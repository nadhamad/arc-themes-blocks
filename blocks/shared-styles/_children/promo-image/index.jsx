import React from 'react';
import { useFusionContext } from 'fusion:context';
import { useContent } from 'fusion:content';
import getProperties from 'fusion:properties';
import { extractImageFromStory, extractResizedParams, ratiosFor } from '@wpmedia/resizer-image-block';
import { Image } from '@wpmedia/engine-theme-sdk';
import PlaceholderImage from '@wpmedia/placeholder-image-block';
import { PromoLabel } from '@wpmedia/shared-styles';
import discoverPromoType from './discover';

import './styles.scss';

const PromoImage = ({
  content = {},
  customImageURL = null,
  alt = '',
  linkURL,
  newTab,
  promoSize,
  imageRatio,
  showPromoLabel = false,
  promoLabelSize = 'small',
  lazyLoad = false,
}) => {
  const { arcSite, isAdmin } = useFusionContext();
  const promoType = showPromoLabel ? discoverPromoType(content) : null;
  const ratios = ratiosFor(promoSize, imageRatio);

  let imageConfig = null;
  if (
    (customImageURL && lazyLoad)
    || (customImageURL && isAdmin)) {
    imageConfig = 'resize-image-api-client';
  } else if (customImageURL) {
    imageConfig = 'resize-image-api';
  }

  const customFieldImageResizedImageOptions = useContent({
    source: imageConfig,
    query: { raw_image_url: customImageURL },
  }) || undefined;

  const imageURL = customImageURL || extractImageFromStory(content);
  const resizedImageOptions = customImageURL
    ? customFieldImageResizedImageOptions
    : extractResizedParams(content);

  const hasLink = () => content?.websites?.[arcSite]?.website_url || linkURL;

  const withLink = (item) => (
    <a
      href={content?.websites?.[arcSite]?.website_url || linkURL}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noreferrer noopener' : ''}
      aria-hidden="true"
      tabIndex="-1"
    >
      {item}
    </a>
  );

  const ImageOrPlaceholder = imageURL
    ? (
      <Image
        url={imageURL}
        alt={content && content.headlines ? content.headlines.basic : alt}
        {...ratios}
        breakpoints={getProperties(arcSite)?.breakpoints}
        resizerURL={getProperties(arcSite)?.resizerURL}
        resizedImageOptions={resizedImageOptions}
      />
    )
    : (
      <PlaceholderImage
        {...ratios}
        client={imageConfig === 'resize-image-api-client'}
      />
    );

  return (
    <div className="promo-image">
      {hasLink() ? withLink(ImageOrPlaceholder) : ImageOrPlaceholder}
      {showPromoLabel && promoType ? <PromoLabel type={promoType} size={promoLabelSize} /> : null}
    </div>
  );
};

export default PromoImage;
