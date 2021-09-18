import Navigation from "../../navigation/Navigation";
import RouteResultsElement from "../../routeelementskeeper/RouteResultsElement";
import './style.css'
import DropdownSearchSelection from "../../dropdownsearchselection/DropdownSearchSelection";
import {useEffect, useState} from "react";
import ReservationService from "../../rest/functionalities/ReservationService";
import ClientSideTempCalculations from '../../utils/ClientSideTempCalculations'
import RequiredInput from "../../utils/RequiredInput";
import LinkButton from "../../utils/LinkButton";
import EmailValidator from "../../utils/EmailValidator";

const ReserveNow = ({history}) => {
    const [options, setOptions] = useState([]);
    const parsed = JSON.parse(sessionStorage.getItem(history.location.state));
    // eslint-disable-next-line no-unused-vars
    const {route, priceInGeneral} = parsed;

    const calculator = new ClientSideTempCalculations();

    useEffect(() => getOptions(), []);

    const getAddBtn = () => <button className={"reservenow__form-add-btn"} onClick={() => addPassengerForm()}>+</button>

    const getRoute = () => {
        const generalTrip = (
            <div className={"reservenow__general"}>
                Summary for trip
                <span><b>{route[0].result.start + ' - ' + route[route.length - 1].result.end}</b></span>
                <span
                    className={"reservenow__general-date"}>{route[0].result.arrivalTime + ' - ' + route[route.length - 1].result.departureTime}</span>
            </div>
        )

        const content = [...route]
            .map((frag, index) => {
                const startCity = frag.result.start;
                const endCity = frag.result.end;
                const arrivalTime = frag.result.arrivalTime;
                const departureTime = frag.result.departureTime;
                const trainName = frag.additionalData.trainName;
                const trainModel = frag.additionalData.trainModel;
                const price = frag.price;
                return <RouteResultsElement
                    startCity={startCity}
                    endCity={endCity}
                    arrivalTime={arrivalTime}
                    departureTime={departureTime}
                    trainModel={trainModel}
                    trainName={trainName}
                    price={price}
                    passengers={passengers}
                    calculationOnClick={getAddBtn()}
                    setNonBottomFromLast={index === route.length - 1}/>
            });

        const generalPrice = getGeneralPrice([...route].map(frag => frag.price))
        return <div className={"reservenow__content-route"}>
            {generalTrip}
            {content}
            {generalPrice}
        </div>;
    }
    const getGeneralPrice = prices => {
        let sumArray = [];
        let sumDiscountedPrices = [];
        passengers.forEach((passenger, index) => {
            let person = passenger.name + ' ' + passenger.surname;
            if (person.trim() === '') {
                person = 'Person n.' + (index + 1);
            }
            const sumForPassenger = calculator.getSumForPassenger(prices, passenger.discount);
            sumDiscountedPrices.push(sumForPassenger);
            sumArray.push(<div className={"reservenow__price-summary reservenow__price-summary--element"}>
                <div>{person}</div>
                {passenger.discount !== '' ? (<div>
                        <span className={"reservenow__crossed-line"}>{calculator.sum(prices)} zl </span>
                        {sumForPassenger}
                    </div>)
                    : (<div>
                        {sumForPassenger}
                    </div>)
                }
            </div>)
        })
        return <section>
            <article className={"reservenow__price-summary"}>
                <div>Summary price</div>
                <div>{`${calculator.sum(sumDiscountedPrices)} zl`}</div>
            </article>
            <div>{sumArray && sumArray.length > 1 ? sumArray : ''}</div>
        </section>;
    }


    const handleChange = (e, index, valueFromDropdown) => {
        const controlName = e.target.name;
        const passenger = passengers[index];
        if (controlName === 'Name') {
            passenger.name = e.target.value;
        } else if (controlName === 'Surname') {
            passenger.surname = e.target.value;
        } else if (controlName === 'Email') {
            passenger.email = e.target.value;
        } else {
            if (valueFromDropdown) {
                passenger.discount = options.filter(s => s.value === valueFromDropdown.value)
                    .map(s => s.key)[0];
            }
        }
        const passArray = [...passengers];
        passArray[index] = passenger;
        setPassengers(passArray);
    }

    const [passengers, setPassengers] = useState([{
        name: '',
        surname: '',
        email: '',
        discount: ''
    }]);

    const getOptions = () => {
        ReservationService.getPossibleDiscounts(json => {
            const opts = [{
                key: '',
                value: '',
                text: ''
            }];
            for (const [key, value] of Object.entries(json)) {
                opts.push({
                    key: key,
                    value: key,
                    text: `${key} (${value}%)`
                })
            }
            setOptions(opts);
        })
    }

    const getForm = index => {
        return <div className={"reservenow__form-wrapper"}>
            <form className={"reservenow__form"}>
                <header className={"reservenow__form-header"}>
                    Person n.{index + 1}
                </header>
                <div className={"reservenow__form-element"}>
                    <label>Name:</label>
                    <RequiredInput className={"reservenow__form-input"}
                                   value={passengers[index] ? passengers[index].name : ''}
                                   type={"personalData"}
                                   name={"Name"} placeholder={"Type name"}
                                   onChange={e => handleChange(e, index)}/>
                </div>
                <div className={"reservenow__form-element"}>
                    <label>Surname:</label>
                    <RequiredInput className={"reservenow__form-input"}
                                   value={passengers[index] ? passengers[index].surname : ''} name={"Surname"}
                                   type={"personalData"}
                                   placeholder={"Type surname"}
                                   onChange={e => handleChange(e, index)}/>
                </div>
                <div className={"reservenow__form-element"}>
                    <label>Email:</label>
                    <RequiredInput className={"reservenow__form-input"}
                                   value={passengers[index] ? passengers[index].email : ''}
                                   name={"Email"} placeholder={"Type email"}
                                   onChange={e => handleChange(e, index)}
                                   type={"email"}/>
                </div>
                <div className={"reservenow__form-element"}>
                    <label>Discount:</label>
                    <DropdownSearchSelection className={"reservenow__form-input"}
                                             options={options}
                                             onSearchChange={(e, v) => handleChange(e, index, v)}
                                             value={passengers[index] ? passengers[index].discount : ''}/>
                </div>
            </form>
        </div>
    }
    const addPassengerForm = () => {
        setPassengersForm(prev => [...prev, getForm()]);
        setPassengers(prev => [...prev, {
            name: '',
            surname: '',
            email: '',
            discount: ''
        }])
    }

    const [passengersForm, setPassengersForm] = useState([getForm()]);

    const getPassengers = () => {
        return <div className={"reservenow__form-wrapper-for-all"}>
            {passengersForm.map((el, index) => {
                if (index === passengersForm.length - 1) {
                    return (
                        <div>
                            <div className={"reservenow__form-section"}>
                                {getForm(index)}
                            </div>
                            {getAddBtn()}
                        </div>
                    )
                }
                return getForm(index);
            })}
        </div>
    }

    const hasErrors = () => {
        let errors = false;
        passengers.forEach(({name, surname, email}) => {
            if (!name || !surname || !email || name === '' || surname === '' || email === '' || !EmailValidator.isValid(email)) {
                errors = true;
            }
        });
        return errors;
    }

    const getReservationBtn = () => {
        const objToSend = {
            route: route,
            passengers: passengers
        }
        return <div className={"reservenow__reservebtn-wrapper"}>
            <LinkButton disabled={hasErrors()} className={"reservenow__reservebtn"} to={"/payment"}
                        param={objToSend} storageName={"dataForPayment"}>Reserve</LinkButton>
        </div>
    }

    return <div>
        <Navigation/>
        <main className={"reservenow"}>
            <section className={"reservenow__wrapper"}>
                {getPassengers()}
            </section>
            <section className={"reservenow__route"}>
                {getRoute()}
                {getReservationBtn()}
            </section>
        </main>
    </div>
}

export default ReserveNow;