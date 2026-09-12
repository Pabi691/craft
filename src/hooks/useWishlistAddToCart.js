import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useGlobal } from '../context/GlobalContext';
import { isDistributor } from '../lib/userRole';
import { alertDialog, confirmDialog } from '../lib/swal';

/**
 * Wishlist item actions shared by /wishlist and the cart's "saved for later"
 * strip (same behaviour as the reference hook): add-to-cart with an optional
 * size step (when the product has more than one size) and a required quantity
 * step for distributors, plus remove.
 */
export function useWishlistAddToCart({ navigateOnSuccess = true } = {}) {
  const { addToCart, setWishlist } = useGlobal();
  const navigate = useNavigate();

  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isSizePopupOpen, setIsSizePopupOpen] = useState(false);
  const [isQtyPopupOpen, setIsQtyPopupOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(null);

  const getSizeOptions = (item) => {
    const product = item?.product || item;
    const variations = Array.isArray(product?.product_variations) ? product.product_variations : [];
    const seen = new Set();
    return variations
      .filter((v) => v?.size && String(v.size).trim() !== '')
      .filter((v) => {
        const key = v.size_id ?? v.size;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  const getItemPackQty = (item, variationOverride) => {
    if (!item) return 10;
    const product = item?.product || item;
    const variation = variationOverride || item?.product_variation || null;
    const packQty = Number(variation?.pack_qty || product?.pack_qty || 0);
    return packQty > 0 ? packQty : 10;
  };

  const addItemToCart = async (item, quantity, variationOverride) => {
    const product = item?.product || item;
    if (!product?.id) return false;
    const variation = variationOverride || item?.product_variation || null;
    const productForCart = variation ? { ...product, product_variations: [variation] } : product;

    setAddingId(item.id);
    try {
      const result = await addToCart(productForCart, variation?.id || null, quantity);
      if (result.ok) {
        if (navigateOnSuccess) navigate('/cart');
      } else {
        alertDialog({ title: 'Could not add to bag', text: result.message, icon: 'error' });
      }
      return result.ok;
    } finally {
      setAddingId(null);
    }
  };

  const openQtyPopupOrAdd = (item, variationOverride) => {
    if (isDistributor()) {
      setSelectedQuantity(null);
      setIsQtyPopupOpen(true);
    } else {
      addItemToCart(item, 1, variationOverride);
    }
  };

  const handleAddToCartClick = (item) => {
    setCurrentItem(item);
    setSelectedVariation(null);
    if (getSizeOptions(item).length > 1) {
      setIsSizePopupOpen(true);
      return;
    }
    openQtyPopupOrAdd(item, item?.product_variation || null);
  };

  const closeSizePopup = () => {
    setIsSizePopupOpen(false);
    setSelectedVariation(null);
  };

  const confirmSize = () => {
    if (!currentItem || !selectedVariation) return;
    setIsSizePopupOpen(false);
    openQtyPopupOrAdd(currentItem, selectedVariation);
  };

  const closeQtyPopup = () => {
    setIsQtyPopupOpen(false);
    setSelectedQuantity(null);
  };

  const confirmQuantity = async () => {
    if (!currentItem || !selectedQuantity) return;
    const item = currentItem;
    const qty = selectedQuantity;
    const variation = selectedVariation;
    closeQtyPopup();
    await addItemToCart(item, qty, variation);
  };

  const removeFromWishlist = async (itemId) => {
    const confirmed = await confirmDialog({
      title: 'Remove this piece?',
      text: 'It will be removed from your wishlist.',
      confirmText: 'Yes, remove',
    });
    if (!confirmed) return;

    setRemovingId(itemId);
    try {
      await api.get(`/api/v1/delete_wishlist_item/${itemId}`);
      setWishlist((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      alertDialog({ title: 'Could not remove item', text: 'Something went wrong. Please try again.', icon: 'error' });
    } finally {
      setRemovingId(null);
    }
  };

  return {
    addingId,
    removingId,
    currentItem,
    isSizePopupOpen,
    sizeOptions: getSizeOptions(currentItem),
    selectedVariation,
    setSelectedVariation,
    closeSizePopup,
    confirmSize,
    isQtyPopupOpen,
    selectedQuantity,
    setSelectedQuantity,
    popupQuantities: Array.from({ length: 10 }, (_, i) => (i + 1) * getItemPackQty(currentItem, selectedVariation)),
    getItemPackQty,
    closeQtyPopup,
    confirmQuantity,
    handleAddToCartClick,
    removeFromWishlist,
  };
}
