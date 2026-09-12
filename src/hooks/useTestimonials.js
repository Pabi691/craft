import { useEffect, useState } from 'react';
import api from '../lib/api';
import { sessionCache } from '../lib/cache';
import { SITE } from '../config/site';

// Store testimonials (CRM → Google Reviews), falling back to the ones on
// craftcombine.org while the API is unreachable.
export function useTestimonials() {
  const [items, setItems] = useState(() => sessionCache.get('cw_testimonials') || SITE.testimonials);

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/get_gmb_reviews')
      .then(({ data }) => {
        const list = Array.isArray(data?.reviews) ? data.reviews : [];
        if (alive && list.length) {
          setItems(list);
          sessionCache.set('cw_testimonials', list);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return items;
}
