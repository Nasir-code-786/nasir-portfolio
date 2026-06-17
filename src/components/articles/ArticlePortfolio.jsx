import "./ArticlePortfolio.scss";
import React, { useMemo, useState } from "react";
import Article from "/src/components/articles/base/Article.jsx";
import Transitionable from "/src/components/capabilities/Transitionable.jsx";
import { useViewport } from "/src/providers/ViewportProvider.jsx";
import { useConstants } from "/src/hooks/constants.js";
import ImageView from "/src/components/generic/ImageView.jsx";
import Link from "/src/components/generic/Link.jsx";
import { Tag, Tags } from "/src/components/generic/Tags.jsx";
import ArticleItemPreviewMenu from "/src/components/articles/partials/ArticleItemPreviewMenu.jsx";
import { useLanguage } from "/src/providers/LanguageProvider.jsx";
import { useFeedbacks } from "/src/providers/FeedbacksProvider.jsx";
import { useUtils } from "/src/hooks/utils.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolio({ dataWrapper, id }) {
  const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null);

  return (
    <Article
      id={dataWrapper.uniqueId}
      type={Article.Types.SPACING_DEFAULT}
      dataWrapper={dataWrapper}
      className={`article-portfolio`}
      selectedItemCategoryId={selectedItemCategoryId}
      setSelectedItemCategoryId={setSelectedItemCategoryId}
    >
      <ArticlePortfolioItems
        dataWrapper={dataWrapper}
        selectedItemCategoryId={selectedItemCategoryId}
      />
    </Article>
  );
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItems({ dataWrapper, selectedItemCategoryId }) {
  const constants = useConstants();
  const language = useLanguage();
  const viewport = useViewport();

  const filteredItems = dataWrapper.getOrderedItemsFilteredBy(
    selectedItemCategoryId,
  );
  const customBreakpoint = viewport.getCustomBreakpoint(
    constants.SWIPER_BREAKPOINTS_FOR_THREE_SLIDES,
  );

  const itemsPerRow = customBreakpoint?.slidesPerView || 1;
  const itemsPerRowClass = `article-portfolio-items-${itemsPerRow}-per-row`;

  const refreshFlag = dataWrapper.categories?.length
    ? selectedItemCategoryId + "-" + language.getSelectedLanguage()?.id
    : language.getSelectedLanguage()?.id;

  if (dataWrapper.categories?.length) {
    return (
      <Transitionable
        id={dataWrapper.uniqueId}
        refreshFlag={refreshFlag}
        delayBetweenItems={100}
        animation={Transitionable.Animations.POP}
        className={`article-portfolio-items ${itemsPerRowClass}`}
      >
        {filteredItems.map((itemWrapper, key) => (
          <ArticlePortfolioItem itemWrapper={itemWrapper} key={key} />
        ))}
      </Transitionable>
    );
  } else {
    return (
      <div className={`article-portfolio-items ${itemsPerRowClass}`}>
        {filteredItems.map((itemWrapper, key) => (
          <ArticlePortfolioItem itemWrapper={itemWrapper} key={key} />
        ))}
      </div>
    );
  }
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {String[]}
 */
function getPortfolioImages(itemWrapper) {
  const images = [];

  const addImage = (src) => {
    if (src && images.indexOf(src) === -1) images.push(src);
  };

  addImage(itemWrapper.img);
  itemWrapper.preview?.screenshots?.forEach(addImage);

  return images;
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemMedia({ itemWrapper }) {
  const language = useLanguage();
  const feedbacks = useFeedbacks();
  const utils = useUtils();

  const images = useMemo(() => getPortfolioImages(itemWrapper), [itemWrapper]);
  const aspectRatio = itemWrapper.preview?.screenshotsAspectRatio || "16:9";
  const galleryTitle = utils.string.extractFirstPart(
    itemWrapper.locales.title || "",
  );

  const openGallery = (event) => {
    event?.stopPropagation?.();

    if (!images.length) return;

    feedbacks.displayGallery(
      images,
      aspectRatio,
      galleryTitle || language.getString("gallery"),
    );
  };

  return (
    <div className={`article-portfolio-item-media`}>
      <div
        className={`article-portfolio-item-media-frame ${images.length === 1 ? `is-clickable` : ``}`}
        onClick={images.length === 1 ? openGallery : undefined}
        onKeyDown={
          images.length === 1
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") openGallery();
              }
            : undefined
        }
        role={images.length === 1 ? `button` : undefined}
        tabIndex={images.length === 1 ? 0 : undefined}
        aria-label={
          images.length === 1 ? language.getString("open_gallery") : undefined
        }
      >
        {images.length === 0 && (
          <div className={`article-portfolio-item-image-fallback`}>
            <i className={itemWrapper.faIcon || `fa-solid fa-code`} />
          </div>
        )}

        {images.length === 1 && (
          <ImageView
            src={images[0]}
            alt={itemWrapper.imageAlt}
            className={`article-portfolio-item-image`}
            hideSpinner={true}
          />
        )}

        {images.length > 1 && (
          <ArticlePortfolioItemCarousel
            images={images}
            alt={itemWrapper.imageAlt}
          />
        )}

        {images.length > 0 && (
          <button
            type={`button`}
            className={`article-portfolio-item-media-expand`}
            aria-label={language.getString("open_gallery")}
            title={language.getString("open_gallery")}
            onClick={openGallery}
          >
            <i className={`fa-solid fa-up-right-and-down-left-from-center`} />
          </button>
        )}
      </div>

      <div className={`article-portfolio-item-media-shade`} />
      <span className={`article-portfolio-item-media-badge`}>
        Featured Project
      </span>
    </div>
  );
}

/**
 * @param {String[]} images
 * @param {String} alt
 * @param {Function} onExpand
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemCarousel({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`article-portfolio-item-carousel`}>
      <span className={`article-portfolio-item-carousel-counter`}>
        {activeIndex + 1} / {images.length}
      </span>

      <Swiper
        className={`article-portfolio-item-carousel-swiper`}
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        navigation={true}
        grabCursor={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {images.map((image, key) => (
          <SwiperSlide
            key={key}
            className={`article-portfolio-item-carousel-slide`}
          >
            <ImageView
              src={image}
              alt={`${alt || "Project screenshot"} ${key + 1}`}
              className={`article-portfolio-item-image`}
              hideSpinner={true}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItem({ itemWrapper }) {
  const language = useLanguage();
  const primaryLink = itemWrapper.preview?.links?.[0];

  return (
    <div className={`article-portfolio-item`}>
      <ArticlePortfolioItemMedia itemWrapper={itemWrapper} />

      <div className={`article-portfolio-item-content`}>
        <div className={`article-portfolio-item-header`}>
          <div className={`article-portfolio-item-header-text`}>
            <span className={`article-portfolio-item-eyebrow`}>
              Production build
            </span>
            <h5
              className={`article-portfolio-item-title`}
              dangerouslySetInnerHTML={{
                __html: itemWrapper.locales.title || itemWrapper.placeholder,
              }}
            />
          </div>

          {primaryLink?.href && (
            <Link
              href={primaryLink.href}
              className={`article-portfolio-item-header-link`}
              tooltip={language.getString(
                primaryLink.tooltipString || "open_website",
              )}
            >
              <i
                className={
                  primaryLink.faIcon || `fa-solid fa-arrow-up-right-from-square`
                }
              />
            </Link>
          )}
        </div>

        <ArticlePortfolioItemBody itemWrapper={itemWrapper} />
        <ArticlePortfolioItemFooter
          itemWrapper={itemWrapper}
          primaryLink={primaryLink}
        />
      </div>
    </div>
  );
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemBody({ itemWrapper }) {
  return (
    <div className={`article-portfolio-item-body`}>
      {itemWrapper.locales.tags && Boolean(itemWrapper.locales.tags.length) && (
        <Tags className={`article-portfolio-item-body-tags`}>
          {itemWrapper.locales.tags.map((tag, key) => (
            <Tag
              key={key}
              text={tag}
              className={`article-portfolio-item-body-tag text-1`}
            />
          ))}
        </Tags>
      )}

      <div
        className={`article-portfolio-item-body-description text-4`}
        dangerouslySetInnerHTML={{ __html: itemWrapper.locales.text }}
      />
    </div>
  );
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {Object|null} primaryLink
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemFooter({ itemWrapper, primaryLink }) {
  const language = useLanguage();

  const hasPreview = itemWrapper.preview;
  const hasPreviewLinks = itemWrapper.preview?.hasLinks;
  const hasScreenshotsOrVideo =
    itemWrapper.preview?.hasScreenshotsOrYoutubeVideo;
  const previewMenuAvailable =
    hasPreview && (hasPreviewLinks || hasScreenshotsOrVideo);
  const extraLinks = (itemWrapper.preview?.links || []).length > 1;

  return (
    <div className={`article-portfolio-item-footer`}>
      {primaryLink?.href && (
        <Link
          href={primaryLink.href}
          className={`article-portfolio-item-cta text-3`}
          tooltip={language.getString(
            primaryLink.tooltipString || "open_website",
          )}
        >
          <span>{language.getString("open_website")}</span>
          <i className={`fa-solid fa-arrow-right`} />
        </Link>
      )}

      {previewMenuAvailable && extraLinks && (
        <ArticleItemPreviewMenu
          itemWrapper={itemWrapper}
          spaceBetween={true}
          className={`article-portfolio-item-footer-menu`}
        />
      )}
    </div>
  );
}

export default ArticlePortfolio;
