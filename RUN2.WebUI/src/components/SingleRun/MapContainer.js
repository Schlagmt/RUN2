import React from 'react';
import { GoogleMap, useJsApiLoader, Polyline} from '@react-google-maps/api';
import _ from 'lodash';

const mapStyles = {
    width: '30em',
    height: '30em',
}

function MapContainer(props) {
    
    const coordinates = props.coordinates
    const initialX = _.sumBy(props.coordinates, (point) => {return point.lat}) / props.coordinates.length
    const initialY = _.sumBy(props.coordinates, (point) => {return point.lng}) / props.coordinates.length

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAcefUBiNkcmqNvy2LGZkHfqh8WNVj6J7I"
    })

    return isLoaded ? (
        <GoogleMap 
            mapContainerStyle={mapStyles}
            center={{lat: initialX, lng: initialY}}
            zoom={13}>    
            <Polyline
                path={coordinates}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2} />
        </GoogleMap>
    ) : <></>
}

export default React.memo(MapContainer)