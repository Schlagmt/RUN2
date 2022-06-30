import React from 'react';
import { GoogleMap, useJsApiLoader, Polyline} from '@react-google-maps/api';
import _ from 'lodash';

const mapStyles = {
    width: '100%',
    height: '100%',
}

const coordinatesOptions = {
    strokeColor: '#000000',
    fillColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1    
}

const highlightOptions = {
    strokeColor: '#FF0000',
    fillColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1
}

function MapContainer(props) {
    
    const mergeCoordinates = [].concat.apply([], [].concat.apply([], props.coordinates))
    
    const center = {
        lat: _.sumBy(mergeCoordinates, (point) => {return point.Latitude}) / mergeCoordinates.length,
        lng: _.sumBy(mergeCoordinates, (point) => {return point.Longitude}) / mergeCoordinates.length
    }
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAcefUBiNkcmqNvy2LGZkHfqh8WNVj6J7I"
    })

    return isLoaded ?
        (
            <GoogleMap mapContainerStyle={mapStyles} center={center} zoom={14}>    
                <PolylineGenerator coordinates={props.coordinates} highlightedSection={props.highlightedSection}/>
            </GoogleMap>
        )
        :
        (
            <></>
        )
}

function PolylineGenerator(props){
    return _.map(props.coordinates, (route, routeIndex) => {
        return _.map(route, (street, streetIndex) => {
            var coordinates = _.map(street, (point) => {
                return {lat: point.Latitude, lng: point.Longitude}
            })

            if (streetIndex < route.length - 1 && props.coordinates.length === 1){
                coordinates.push({lat: route[streetIndex+1][0].Latitude, lng: route[streetIndex+1][0].Longitude})
            }

            var isHighlighted = coordinatesOptions
            if (props.highlightedSection !== null && street[0].Street === props.highlightedSection[0].Street)
                isHighlighted = highlightOptions

            
            return (
                <Polyline key={window.getRandomKey()} path={coordinates} options={isHighlighted}/>
            )
        })
    })
}

export default React.memo(MapContainer)