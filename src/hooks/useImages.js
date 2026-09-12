import { useEffect, useState } from 'react';
import api from '../lib/api';
import { sessionCache } from '../lib/cache';

const isActive = (img) => img && (img.is_active === true || Number(img.is_active) === 1);

// Images managed in the CRM (homepage banners, gallery …), cached per session.
export function useImages({ image_type, page_key } = {}) {
  const key = `cw_images_${image_type || 'all'}_${page_key || 'all'}`;
  const cached = sessionCache.get(key);
  const [images, setImages] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let alive = true;
    const params = {};
    if (image_type) params.image_type = image_type;
    if (page_key) params.page_key = page_key;
    api
      .get('/api/images', { params })
      .then(({ data }) => {
        const list = (Array.isArray(data?.data) ? data.data : [])
          .filter(isActive)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        if (alive) {
          setImages(list);
          sessionCache.set(key, list);
        }
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [key, image_type, page_key]);

  return { images, loading };
}
