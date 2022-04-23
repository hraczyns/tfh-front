import './reservenow.css';

const ReserveNowPreOnLoginPanel = ({onClick, onClickLogin}) => {
    return <article className={"reserve-now-pre-on-login-panel-wrapper"}>
        <header className={"reserve-now-pre-on-login-header"}>You are about to create a reservation.</header>
        <article className={"reserve-now-pre-on-login-panel"}>
            <section>
                Do you want to continue without account? <br/>
                <button onClick={() => onClick && onClick()}>Continue</button>
            </section>
            <section className={"reserve-now-pre-on-login-delimiter"}/>
            <section>
                Or login firstly<br/>
                <button  onClick={() => onClickLogin && onClickLogin()}>Login</button>
            </section>
        </article>
    </article>
}

export default ReserveNowPreOnLoginPanel;