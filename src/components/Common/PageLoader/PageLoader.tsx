import "./pageLoader.css"

export const PageLoader = () => {
    return (
        <div className="loader">
            <div className="dot">L</div>
            <div className="dot">O</div>
            <div className="dot">A</div>
            <div className="dot">D</div>
            <div className="dot">I</div>
            <div className="dot">N</div>
            <div className="dot">G</div>
            <div className="cogs">
                <div className="cog cog0">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div className="cog cog1">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div className="cog cog2">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
        </div>
    )
}