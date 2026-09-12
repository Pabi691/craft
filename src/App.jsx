import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ToastContainer, Slide } from 'react-toastify';
import { watchBrandColor } from './lib/theme';
import SmoothScroll, { useLenis } from './components/motion/SmoothScroll';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileTabBar from './components/layout/MobileTabBar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PageTransition from './components/ui/PageTransition';
import PageLoader from './components/ui/PageLoader';
import Preloader from './components/ui/Preloader';
import Cursor from './components/ui/Cursor';
import ScrollProgress from './components/ui/ScrollProgress';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Search = lazy(() => import('./pages/Search'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ReviewSubmission = lazy(() => import('./pages/ReviewSubmission'));
const Account = lazy(() => import('./pages/account/Account'));
const OrderDetails = lazy(() => import('./pages/account/OrderDetails'));
const ReturnRequest = lazy(() => import('./pages/account/ReturnRequest'));
const Logout = lazy(() => import('./pages/auth/Logout'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const page = (element) => (
  <PageTransition>
    <Suspense fallback={<PageLoader />}>{element}</Suspense>
  </PageTransition>
);

const guarded = (element) => page(<ProtectedRoute>{element}</ProtectedRoute>);

function Shell() {
  const location = useLocation();
  const lenis = useLenis();
  const isHome = location.pathname === '/';

  useEffect(() => watchBrandColor(), []);

  // Account tabs share one key so switching them animates the tab indicator
  // instead of replaying the full page curtain.
  const routeKey = /^\/myaccount(\/(orders|addresses|profile))?$/.test(location.pathname) ? '/myaccount' : location.pathname;

  const scrollTop = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  };

  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Header />
      {/* The home hero sits under the transparent header; other pages start below it. */}
      {!isHome && <div aria-hidden className="pt-header" />}

      <AnimatePresence mode="wait" onExitComplete={scrollTop}>
        <Routes location={location} key={routeKey}>
          <Route path="/" element={page(<Home />)} />
          <Route path="/products" element={page(<Shop showAll />)} />
          <Route path="/search" element={page(<Search />)} />
          <Route path="/p/:slug" element={page(<ProductDetails />)} />
          <Route path="/cart" element={page(<Cart />)} />
          <Route path="/checkout" element={page(<Checkout />)} />
          <Route path="/thank-you" element={page(<ThankYou />)} />
          <Route path="/wishlist" element={guarded(<Wishlist />)} />

          <Route path="/login" element={page(<Login />)} />
          <Route path="/register" element={page(<Register />)} />
          <Route path="/reset-password" element={page(<ResetPassword />)} />
          <Route path="/email-verification" element={page(<VerifyEmail />)} />
          <Route path="/review/:token" element={page(<ReviewSubmission />)} />
          <Route path="/logout" element={page(<Logout />)} />

          <Route path="/myaccount" element={guarded(<Account section="Overview" />)} />
          <Route path="/myaccount/orders" element={guarded(<Account section="My Orders" />)} />
          <Route path="/myaccount/addresses" element={guarded(<Account section="My Addresses" />)} />
          <Route path="/myaccount/profile" element={guarded(<Account section="My Profile" />)} />
          <Route path="/myaccount/order/:orderId" element={guarded(<OrderDetails />)} />
          <Route path="/myaccount/return/:orderId" element={guarded(<ReturnRequest />)} />
          <Route path="/myaccount/*" element={<Navigate to="/404" replace />} />

          <Route path="/about-us" element={page(<About />)} />
          <Route path="/gallery" element={page(<Gallery />)} />
          <Route path="/contact-us" element={page(<Contact />)} />
          <Route path="/privacy-policy" element={page(<InfoPage slug="privacy-policy" />)} />
          <Route path="/terms-and-conditions" element={page(<InfoPage slug="terms-and-conditions" />)} />
          <Route path="/return-policy" element={page(<InfoPage slug="return-policy" />)} />

          <Route path="/404" element={page(<NotFound />)} />
          {/* Category landing pages resolve by slug, like the reference: /bags, /accessories … */}
          <Route path="/:categorySlug" element={page(<Shop />)} />
          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </AnimatePresence>

      <Footer />
      <MobileTabBar />
      <ToastContainer
        position="bottom-center"
        autoClose={2600}
        hideProgressBar={false}
        closeButton={false}
        transition={Slide}
        newestOnTop
        theme="light"
      />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Shell />
      </SmoothScroll>
    </MotionConfig>
  );
}
