import Navigation from "../../navigation/Navigation";
import RouteResultsElement from "../../routeelementskeeper/RouteResultsElement";
import './reservenow.css'
import DropdownSearchSelection from "../../dropdownsearchselection/DropdownSearchSelection";
import {useEffect, useState} from "react";
import reservationService from "../../rest/functionalities/ReservationService";
import ClientSideTempCalculations from '../../utils/ClientSideTempCalculations'
import ValidatedInput from "../../utils/ValidatedInput";
import LinkButton from "../../utils/LinkButton";
import {reserveNowMapper} from "./ReserveNowMapper";

const NAME = 'name';
const SURNAME = 'surname';
const EMAIL = 'email';
const DISCOUNT = 'discount';
const EMPTY_OPTION = {
    key: '',
    value: '',
    text: ''
}

const ReserveNowPanel = ({route, user : {id: userId, name: userName, surname: userSurname, email: userEmail}}) => {
    const [isReady, setReady] = useState(false)
    const [options, setOptions] = useState([]);
    const [passengers, setPassengers] = useState([{
        name: {
            value: userName || '',
            isValid: false
        },
        surname: {
            value: userSurname || '',
            isValid: false
        },
        email: {
            value: userEmail || '',
            isValid: false
        },
        discount: {
            value: '',
            isValid: true
        },
    }]);
    const calculator = new ClientSideTempCalculations();

    useEffect(() => {
        (async () => {
            const possibleDiscounts = await reservationService.getPossibleDiscounts();
            const opts = [{...EMPTY_OPTION}];
            for (const [key, value] of Object.entries(possibleDiscounts)) {
                opts.push({
                    key: key,
                    value: key,
                    text: `${key} (${value}%)`
                })
            }
            setOptions(opts);
        })();
    }, []);

    const getAddBtn = () => <button disabled={isReady} className={"reservenow__form-add-btn"}
                                    onClick={() => addPassengerForm()}>+</button>

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
                const {
                    startCity,
                    endCity,
                    arrivalTime,
                    departureTime,
                    trainName,
                    trainModel,
                    price
                } = reserveNowMapper.mapToRouteContent(frag);
                return <RouteResultsElement
                    key={index}
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
            let person = passenger.name?.value + ' ' + passenger.surname?.value;
            if (person.trim() === '') {
                person = 'Person n.' + (index + 1);
            }
            const sumForPassenger = calculator.getSumForPassenger(prices, passenger.discount?.value);
            sumDiscountedPrices.push(sumForPassenger);
            sumArray.push(<div key={index} className={"reservenow__price-summary reservenow__price-summary--element"}>
                <div>{person}</div>
                {passenger.discount?.value !== '' ? (<div>
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
        if (controlName === NAME) {
            passenger.name.value = e.target?.value;
        } else if (controlName === SURNAME) {
            passenger.surname.value = e.target?.value;
        } else if (controlName === EMAIL) {
            passenger.email.value = e.target?.value;
        } else {
            if (valueFromDropdown) {
                passenger.discount.value = options.filter(s => s?.value === valueFromDropdown?.value)
                    .map(s => s.key)[0];
            }
        }
        const passArray = [...passengers];
        passArray[index] = passenger;
        setPassengers(passArray);
    }

    const setValid = (name, isValid, index) => {
        const passenger = passengers[index];
        passenger[name].isValid = isValid;
        const passArray = [...passengers];
        passArray[index] = passenger;
        setPassengers(passArray);
    }

    const getRequiredDependsOnIsReady = (index, prop) => {
        if (prop === DISCOUNT) {
            return <DropdownSearchSelection className={"reservenow__form-input"} disabled={isReady}
                                            options={options}
                                            onSearchChange={(e, v) => handleChange(e, index, v)}
                                            value={passengers[index] ? passengers[index].discount?.value || '' : ''}/>
        }
        if (isReady || (index === 0 && userEmail)) {
            return <label key={index}
                          className={"reservenow__form-confirmed"}>{passengers[index] ? passengers[index][prop]?.value || '' : ''}</label>
        }
        return <ValidatedInput className={"reservenow__form-input"}
                               value={passengers[index] ? passengers[index][prop]?.value || '' : ''}
                               type={(prop === "email" ? "email" : "personalData")}
                               name={prop} placeholder={`Type ${prop}`}
                               onChange={e => handleChange(e, index)}
                               setValid={(name, isValid) => setValid(name, isValid, index)}/>
    }

    const getForm = (index) => {
        return <div className={"reservenow__form-wrapper"} key={index}>
            <form className={"reservenow__form"}>
                <button className={"reservenow__form-cancel"} disabled={index === 0}
                        onClick={() => deleteForm(index)}>x
                </button>
                <header className={"reservenow__form-header"}>
                    Person n.{index + 1}
                </header>
                <div className={"reservenow__form-element"}>
                    <label>Name:</label>
                    {getRequiredDependsOnIsReady(index, 'name')}
                </div>
                <div className={"reservenow__form-element"}>
                    <label>Surname:</label>
                    {getRequiredDependsOnIsReady(index, 'surname')}
                </div>
                <div className={"reservenow__form-element"}>
                    <label>Email:</label>
                    {getRequiredDependsOnIsReady(index, 'email')}
                </div>
                <div className={"reservenow__form-element"}>
                    <label>Discount:</label>
                    {getRequiredDependsOnIsReady(index, 'discount')}
                </div>
            </form>
        </div>
    }

    const deleteForm = (index) => {
        setPassengersForm(prev => [...prev].filter((f, indexOfForm) => indexOfForm !== index));
        setPassengers(prev => [...prev].filter((p, indexOfForm) => indexOfForm !== index))
    }

    const addPassengerForm = () => {
        setPassengersForm(prev => [...prev, getForm()]);
        setPassengers(prev => [...prev, {
            name: {
                value: '',
                isValid: false
            },
            surname: {
                value: '',
                isValid: false
            },
            email: {
                value: '',
                isValid: false
            },
            discount: {
                value: '',
                isValid: true
            }
        }]);
    }

    const [passengersForm, setPassengersForm] = useState([getForm()]);

    const getPassengers = () => {
        return <div className={"reservenow__form-wrapper-for-all"}>
            {passengersForm.map((el, index) => {
                if (index === passengersForm.length - 1) {
                    return (
                        <div key={index}>
                            <div key={index} className={"reservenow__form-section"}>
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
        passengers.forEach(({name, surname, email}, index) => {
            if (index === 0 && userEmail) {
                return;
            }
            if (!name?.isValid || !surname?.isValid || !email?.isValid) {
                errors = true;
            }
        });

        return errors;
    }

    const getReservationBtn = () => {
        const copy = [];
        const existingUsers = [];
        for (const {name, surname, email, discount} of passengers) {
            const passenger = {
                name: name.value,
                surname: surname.value,
                email: email.value,
                discount: discount.value
            };
            if (email.value === userEmail) {
                existingUsers.push({...passenger, userId});
            } else {
                copy.push(passenger);
            }
        }

        const objToSend = {
            route: route,
            passengers: copy,
            existingUsers: existingUsers
        }
        return <div className={"reservenow__reservebtn-wrapper"}>
            {isReady ?
                <div>
                    <LinkButton disabled={hasErrors()} className={"reservenow__reservebtn"}
                                to={"/payment"} param={objToSend} storageName={"dataForPayment"}>Confirm</LinkButton>
                    <button className={"reservenow__reservebtn"} onClick={() => setReady(false)}>Cancel</button>
                </div> :
                <button disabled={hasErrors()} className={"reservenow__reservebtn"}
                        onClick={() => setReady(true)}>Reserve</button>
            }
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

export default ReserveNowPanel;