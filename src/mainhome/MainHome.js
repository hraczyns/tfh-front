import Finder from "../finder/text/Finder";
import './style.css'
import LinkButton from "../utils/LinkButton";

const MainHome = () => {
    return <main className={"mainhome"}>
        <section className={"mainhome__header"}>
            Try to use one of the method to find your best trip
        </section>
        <section className={"mainhome__finders"}>
            <Finder/>
            <div className={"mainhome__or"}>OR</div>
            <LinkButton className={"mainhome__btnmap"} to={"/map"}>
                Use the map to <br/>choose your trip!
                <div className={"mainhome__btnmapicon"}/>
            </LinkButton>
        </section>
    </main>
}

export default MainHome