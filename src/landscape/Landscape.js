import React from "react";
import './landscape.css'

const Landscape = () => {
    return <div className={"landscape__container"}>
        <section className={"landscape__photo"}>
            <div className={"landscape__main"}>
                <div className={"landscape__main__text"}>
                    <a className={"landscape__main__link"} href={"#main"}> Welcome on TFH page</a>
                </div>
                <div className={"landscape__main__encourage"}>Check out this new experience with trains</div>
            </div>
        </section>
    </div>
}

export default Landscape