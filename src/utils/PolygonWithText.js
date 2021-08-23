import React from 'react';
import L from 'leaflet';
import {Marker, Polygon} from 'react-leaflet';
import './style.css';

const PolygonWithText = props => {
    const center = L.polygon(props.coords).getBounds().getCenter();
    let className = 'leaflet-div-icon-for-city';
    if (props.routeChosen) {
        className = 'leaflet-div-icon-for-city leaflet-div-icon-for-city--chosen';
    } else if (props.routeText) {
        className = 'leaflet-div-icon-for-city leaflet-div-icon-for-city--route';
    }
    const text = L.divIcon({
        html: props.text,
        iconSize: null,
        className: className
    });


    return (
        <Polygon color="black" positions={props.coords}>
            <Marker position={center} icon={text} eventHandlers={{
                click: props.onClick
            }}/>
        </Polygon>
    );
}

export default PolygonWithText