import { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const AD_ORIGIN = 'https://alwaysmulticulturallanding.com';
const ADS = {
  native: { script: `${AD_ORIGIN}/a84b5b67b39cd1e8b98d8a4675095397/invoke.js`, id: 'container-a84b5b67b39cd1e8b98d8a4675095397', width: 320, height: 180 },
  mobile: { script: `${AD_ORIGIN}/fad8a52f02f228dfc5b3528ddbe00a06/invoke.js`, width: 320, height: 50, key: 'fad8a52f02f228dfc5b3528ddbe00a06' },
  rectangle: { script: `${AD_ORIGIN}/cefff33120364dc6fa4439bd23421d81/invoke.js`, width: 300, height: 250, key: 'cefff33120364dc6fa4439bd23421d81' },
  leaderboard: { script: `${AD_ORIGIN}/d0adc488978c76a7ea53444f56d70cb8/invoke.js`, width: 728, height: 90, key: 'd0adc488978c76a7ea53444f56d70cb8' },
};

function loadScript(src, setup) {
  if (document.querySelector(`script[data-ad-src="${src}"]`)) return;
  setup?.();
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = src;
  script.dataset.adSrc = src;
  document.body.appendChild(script);
}

function AdSlot({ type = 'native', label = 'Advertisement' }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const ad = ADS[type];

  useEffect(() => {
    if (!ad || !ref.current) return undefined;
    const load = () => {
      if (type === 'native') {
        const container = document.getElementById(ad.id);
        if (container) loadScript(ad.script);
      } else {
        loadScript(ad.script, () => {
          window.atOptions = { key: ad.key, format: 'iframe', height: ad.height, width: ad.width, params: {} };
        });
      }
      setReady(true);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        (window.requestIdleCallback || ((callback) => setTimeout(callback, 1200)))(load);
      }
    }, { rootMargin: '500px 0px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ad, type]);

  if (!ad) return null;
  return (
    <aside ref={ref} className="ad-slot mx-auto my-8 flex w-full justify-center overflow-hidden" aria-label={label} role="complementary">
      <div
        id={ad.id}
        className="flex max-w-full items-center justify-center overflow-hidden"
        style={{ minHeight: ad.height, width: `${ad.width}px`, maxWidth: '100%' }}
        data-ad-ready={ready ? 'true' : 'false'}
      />
    </aside>
  );
}

AdSlot.propTypes = {
  type: PropTypes.oneOf(Object.keys(ADS)),
  label: PropTypes.string,
};

export default memo(AdSlot);
