import React from 'react';
import { GoogleMap, useJsApiLoader, Polyline} from '@react-google-maps/api';
import _ from 'lodash';

const mapStyles = {
    width: '100%',
    height: '100%',
}

function MapContainer(props) {
    
    const coordinates = props.coordinates
    const initialX = _.sumBy(props.coordinates, (point) => {return point.lat}) / props.coordinates.length
    const initialY = _.sumBy(props.coordinates, (point) => {return point.lng}) / props.coordinates.length

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAcefUBiNkcmqNvy2LGZkHfqh8WNVj6J7I"
    })

    const coordinatesOptions = {
        strokeColor: '#000000',
        fillColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
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
        strokeWeight: 4,
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        zIndex: 1       }

    if (isLoaded) {
        if (props.highlight !== null){
            return (
                    <GoogleMap 
                        mapContainerStyle={mapStyles}
                        center={{lat: initialX, lng: initialY}}
                        clickableIcons={false}
                        zoom={14}>    
                        <Polyline
                            path={coordinates}
                            options={coordinatesOptions} />
                        <Polyline
                            path={props.highlight}
                            options={highlightOptions}/>
                    </GoogleMap>
                )
        }
        else {
            return (
                <GoogleMap 
                    mapContainerStyle={mapStyles}
                    center={{lat: initialX, lng: initialY}}
                    clickableIcons={false}
                    zoom={14}>    
                    <Polyline
                            path={coordinates}
                            options={coordinatesOptions} />
                </GoogleMap>                
            )
        }
    }
    
    return <></>
}

export default React.memo(MapContainer)