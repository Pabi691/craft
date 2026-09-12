// Default policy copy, shown until the page is filled in from the CRM
// (Pages → privacy-policy / return-policy / terms-and-conditions).
// Figures mirror how the store actually works: orders can be cancelled
// within 24 hours, COD carries a ₹20 collection charge, shipping is free,
// and refunds go to the bank account the customer adds (up to 14 business days).
// Please have them reviewed before going live.

const contact = `<p>Craft &amp; Weft, 54/1, Bipin Ganguly Road, Kolkata 700030 · +91 90516 26156 / 98306 40086 · <a href="mailto:craftcombine.ac@gmail.com">craftcombine.ac@gmail.com</a></p>`;

export const POLICIES = {
  'return-policy': {
    title: 'Returns & Refunds',
    intro: 'Every piece is handmade, so small variations in weave, colour and finish are part of its character — not a defect.',
    html: `
      <h2>Cancelling an order</h2>
      <p>You can cancel an order from <a href="/myaccount/orders">My Orders</a> within 24 hours of placing it, as long as it has not been delivered.</p>

      <h2>Returns</h2>
      <p>Once an order shows as <strong>Delivered</strong>, a <em>Return</em> button appears against it in My Orders. Choose a reason and submit the request — for a damaged or defective item, please attach a short unboxing or product video (up to 20 MB) so we can resolve it quickly.</p>
      <ul>
        <li>Items should be unused, unwashed and returned with their tags and packaging.</li>
        <li>Natural variations in handloom texture, colour and stitching are not considered defects.</li>
        <li>Products marked <em>Not Returnable</em> on their page cannot be returned.</li>
      </ul>

      <h2>Refunds</h2>
      <p>When your return is accepted you will be asked to add a bank account for the refund from the order page. Refunds are issued after the returned product is verified and can take up to 14 business days to reach your account.</p>
      <p>We reserve the right to decline a refund if the return conditions above are not met.</p>

      <h2>Shipping &amp; COD</h2>
      <p>Shipping is free across India. Cash on Delivery orders carry an additional collection charge of ₹20, which is not refundable once the order has been delivered.</p>

      <h2>Need help?</h2>
      ${contact}
    `,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'We collect only what we need to deliver your order and look after your account.',
    html: `
      <h2>What we collect</h2>
      <ul>
        <li>Account details — your name, email, mobile number, gender and date of birth.</li>
        <li>Delivery details — the shipping addresses you save.</li>
        <li>Order details — the items you buy, payments and returns.</li>
        <li>Refund details — bank account information you choose to add for a refund.</li>
      </ul>

      <h2>How we use it</h2>
      <p>To process and deliver orders, send order and account emails (such as confirmations and email verification), handle returns and refunds, and answer your questions.</p>

      <h2>Payments</h2>
      <p>Online payments are processed by Razorpay. We never see or store your full card details.</p>

      <h2>Sharing</h2>
      <p>We share delivery details only with our courier partners so they can deliver your order. We do not sell your personal information.</p>

      <h2>Your choices</h2>
      <p>You can view and update your profile and addresses from <a href="/myaccount">My Account</a> at any time. To delete your account, write to us.</p>

      <h2>Contact</h2>
      ${contact}
    `,
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    intro: 'By using this website and placing an order, you agree to the terms below.',
    html: `
      <h2>About us</h2>
      <p>Craft &amp; Weft is the commercial wing of Kolkata Craft Combine Society, selling handmade and hand-woven products made by artisans of West Bengal.</p>

      <h2>Products</h2>
      <p>Our products are handcrafted. Colours may look slightly different on screen, and each piece may vary a little in size, weave and finish from the photographs.</p>

      <h2>Prices &amp; payment</h2>
      <ul>
        <li>All prices are in Indian Rupees and include applicable taxes.</li>
        <li>We accept online payment through Razorpay and Cash on Delivery (with a ₹20 collection charge).</li>
        <li>Coupons are subject to their own minimum order value, validity and usage limits.</li>
      </ul>

      <h2>Orders</h2>
      <p>An order is confirmed once you receive the order confirmation. We may cancel an order if a product is unavailable or if pricing or payment information is incorrect; any amount paid will be refunded.</p>

      <h2>Accounts</h2>
      <p>You are responsible for keeping your login details confidential. We may suspend accounts that misuse the service, including repeated order cancellations.</p>

      <h2>Returns</h2>
      <p>Returns and refunds are governed by our <a href="/return-policy">Return Policy</a>.</p>

      <h2>Contact</h2>
      ${contact}
    `,
  },
};
