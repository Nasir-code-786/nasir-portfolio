import "./PreloaderIndicator.scss"
import React from 'react'

function PreloaderIndicator({ className = "", hidden = false }) {
    const hiddenClass = hidden ?
        `preloader-indicator-wrapper-hidden` : ``

    return (
        <div className={`preloader-indicator-wrapper ${className} ${hiddenClass}`}
             role="status"
             aria-label="Loading">
            <div className={`preloader-indicator`}>
                <div className={`preloader-indicator-orbit`}>
                    <span className={`preloader-indicator-orbit-dot preloader-indicator-orbit-dot-1`}/>
                    <span className={`preloader-indicator-orbit-dot preloader-indicator-orbit-dot-2`}/>
                    <span className={`preloader-indicator-orbit-dot preloader-indicator-orbit-dot-3`}/>
                </div>

                <div className={`preloader-indicator-ring`}/>
                <div className={`preloader-indicator-arc`}/>
                <div className={`preloader-indicator-core`}/>
            </div>
        </div>
    )
}

export default PreloaderIndicator
