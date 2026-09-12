import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useGlobal } from '../context/GlobalContext';
import { useWishlistAddToCart } from '../hooks/useWishlistAddToCart';
import { inr } from '../lib/format';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import SmartImage from '../components/ui/SmartImage';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import SizeSelectionPopup from '../components/product/SizeSelectionPopup';
import DistributorQuantityPopup from '../components/product/DistributorQuantityPopup';

export default function Wishlist() {
  const { wishlist, wishlistLoading } = useGlobal();
  const navigate = useNavigate();
  const actions = useWishlistAddToCart();

  return (
    <>
      <Seo title="Wishlist" />

      <section className="container-x pb-24 pt-10 md:pt-14">
        <p className="eyebrow">Saved pieces</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SplitText as="h1" inView={false} text="Your *wishlist*" className="h-display mt-4 text-5xl text-ink-900 md:text-7xl" />
          {wishlist.length > 0 && (
            <p className="text-sm font-semibold text-ink-500">
              {wishlist.length} piece{wishlist.length > 1 ? 's' : ''} saved
            </p>
          )}
        </div>

        {wishlistLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/5] rounded-[1.6rem]" />
                <div className="skeleton mt-4 h-5 w-3/4" />
                <div className="skeleton mt-2 h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={FiHeart}
              title="Nothing saved yet."
              text="Tap the heart on any piece you love and it will wait for you here."
              action={
                <Link to="/products" className="btn-primary">
                  Discover the collection
                </Link>
              }
            />
          </div>
        ) : (
          <motion.div layout className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {wishlist.map((item, i) => {
                const product = item.product || item;
                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: EASE }}
                    className="group"
                  >
                    <Link to={`/p/${product.slug}`} data-cursor="View" className="block overflow-hidden rounded-[1.6rem] bg-paper-200">
                      <SmartImage src={product.primary_img} alt={product.prod_name} className="aspect-[4/5]" imgClassName="duration-[1200ms] group-hover:scale-105" />
                    </Link>
                    <h3 className="mt-4 line-clamp-2 font-display text-lg leading-snug text-ink-900">{product.prod_name}</h3>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-[15px] font-extrabold text-ink-900">{inr(product.sale_price)}</span>
                      {Number(product.regular_price) > Number(product.sale_price) && (
                        <span className="text-xs text-ink-400 line-through">{inr(product.regular_price)}</span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => actions.handleAddToCartClick(item)} disabled={actions.addingId === item.id} className="btn-primary btn-sm flex-1">
                        {actions.addingId === item.id ? <Spinner className="h-3.5 w-3.5" /> : <FiShoppingBag size={13} />} Add to bag
                      </button>
                      <button
                        onClick={() => actions.removeFromWishlist(item.id)}
                        disabled={actions.removingId === item.id}
                        aria-label="Remove from wishlist"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-900/10 text-ink-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                      >
                        {actions.removingId === item.id ? <Spinner className="h-3.5 w-3.5" /> : <FiTrash2 size={14} />}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <SizeSelectionPopup
        open={actions.isSizePopupOpen}
        sizeOptions={actions.sizeOptions}
        selectedVariation={actions.selectedVariation}
        onSelect={actions.setSelectedVariation}
        onClose={actions.closeSizePopup}
        onConfirm={actions.confirmSize}
      />
      <DistributorQuantityPopup
        open={actions.isQtyPopupOpen}
        packQty={actions.getItemPackQty(actions.currentItem, actions.selectedVariation)}
        quantities={actions.popupQuantities}
        selectedQuantity={actions.selectedQuantity}
        onSelect={actions.setSelectedQuantity}
        onClose={actions.closeQtyPopup}
        onConfirm={actions.confirmQuantity}
      />
    </>
  );
}
