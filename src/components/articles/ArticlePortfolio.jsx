import "./ArticlePortfolio.scss"
import React, {useEffect, useState} from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import Transitionable from "/src/components/capabilities/Transitionable.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useConstants} from "/src/hooks/constants.js"
import ImageView from "/src/components/generic/ImageView.jsx"
import Link from "/src/components/generic/Link.jsx"
import {Tag, Tags} from "/src/components/generic/Tags.jsx"
import ArticleItemPreviewMenu from "/src/components/articles/partials/ArticleItemPreviewMenu.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolio({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={dataWrapper.uniqueId}
                 type={Article.Types.SPACING_DEFAULT}
                 dataWrapper={dataWrapper}
                 className={`article-portfolio`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticlePortfolioItems dataWrapper={dataWrapper}
                                   selectedItemCategoryId={selectedItemCategoryId}/>
        </Article>
    )
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItems({ dataWrapper, selectedItemCategoryId }) {
    const constants = useConstants()
    const language = useLanguage()
    const viewport = useViewport()

    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)
    const customBreakpoint = viewport.getCustomBreakpoint(constants.SWIPER_BREAKPOINTS_FOR_THREE_SLIDES)

    const itemsPerRow = customBreakpoint?.slidesPerView || 1
    const itemsPerRowClass = `article-portfolio-items-${itemsPerRow}-per-row`

    const refreshFlag = dataWrapper.categories?.length ?
        selectedItemCategoryId + "-" + language.getSelectedLanguage()?.id :
        language.getSelectedLanguage()?.id

    if(dataWrapper.categories?.length) {
        return (
            <Transitionable id={dataWrapper.uniqueId}
                            refreshFlag={refreshFlag}
                            delayBetweenItems={100}
                            animation={Transitionable.Animations.POP}
                            className={`article-portfolio-items ${itemsPerRowClass}`}>
                {filteredItems.map((itemWrapper, key) => (
                    <ArticlePortfolioItem itemWrapper={itemWrapper}
                                          key={key}/>
                ))}
            </Transitionable>
        )
    }
    else {
        return (
            <div className={`article-portfolio-items ${itemsPerRowClass}`}>
                {filteredItems.map((itemWrapper, key) => (
                    <ArticlePortfolioItem itemWrapper={itemWrapper}
                                          key={key}/>
                ))}
            </div>
        )
    }
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItem({ itemWrapper }) {
    const language = useLanguage()
    const primaryLink = itemWrapper.preview?.links?.[0]

    return (
        <div className={`article-portfolio-item`}>
            <div className={`article-portfolio-item-media`}>
                {itemWrapper.img ? (
                    <ImageView src={itemWrapper.img}
                               alt={itemWrapper.imageAlt}
                               className={`article-portfolio-item-image`}
                               hideSpinner={true}/>
                ) : (
                    <div className={`article-portfolio-item-image-fallback`}>
                        <i className={itemWrapper.faIcon || `fa-solid fa-code`}/>
                    </div>
                )}
                <div className={`article-portfolio-item-media-shade`}/>
            </div>

            <div className={`article-portfolio-item-content`}>
                <div className={`article-portfolio-item-header`}>
                    <h5 className={`article-portfolio-item-title`}
                        dangerouslySetInnerHTML={{__html: itemWrapper.locales.title || itemWrapper.placeholder}}/>

                    {primaryLink?.href && (
                        <Link href={primaryLink.href}
                              className={`article-portfolio-item-header-link`}
                              tooltip={language.getString(primaryLink.tooltipString || "open_website")}>
                            <i className={primaryLink.faIcon || `fa-solid fa-arrow-up-right-from-square`}/>
                        </Link>
                    )}
                </div>

                <ArticlePortfolioItemBody itemWrapper={itemWrapper}/>
                <ArticlePortfolioItemFooter itemWrapper={itemWrapper}
                                            primaryLink={primaryLink}/>
            </div>
        </div>
    )
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
                        <Tag key={key}
                             text={tag}
                             className={`article-portfolio-item-body-tag text-1`}/>
                    ))}
                </Tags>
            )}

            <div className={`article-portfolio-item-body-description text-4`}
                 dangerouslySetInnerHTML={{__html: itemWrapper.locales.text}}/>
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {Object|null} primaryLink
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemFooter({ itemWrapper, primaryLink }) {
    const language = useLanguage()

    const hasPreview = itemWrapper.preview
    const hasPreviewLinks = itemWrapper.preview?.hasLinks
    const hasScreenshotsOrVideo = itemWrapper.preview?.hasScreenshotsOrYoutubeVideo
    const previewMenuAvailable = hasPreview && (hasPreviewLinks || hasScreenshotsOrVideo)
    const extraLinks = (itemWrapper.preview?.links || []).length > 1

    return (
        <div className={`article-portfolio-item-footer`}>
            {primaryLink?.href && (
                <Link href={primaryLink.href}
                      className={`article-portfolio-item-cta text-3`}
                      tooltip={language.getString(primaryLink.tooltipString || "open_website")}>
                    <span>{language.getString("open_website")}</span>
                    <i className={`fa-solid fa-arrow-right`}/>
                </Link>
            )}

            {previewMenuAvailable && extraLinks && (
                <ArticleItemPreviewMenu itemWrapper={itemWrapper}
                                        spaceBetween={true}
                                        className={`article-portfolio-item-footer-menu`}/>
            )}
        </div>
    )
}

export default ArticlePortfolio
