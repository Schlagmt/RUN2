import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Polyline} from 'google-maps-react';
import _ from 'lodash';

const mapStyles = {
    width: '30em',
    height: '30em',
  }

export class MapContainer extends Component {
    constructor(props){
        super()

        this.state = {
            coordinates: props.coordinates,
            initialX: _.sumBy(props.coordinates, (point) => {return point.lat}) / props.coordinates.length,
            initialY: _.sumBy(props.coordinates, (point) => {return point.lng}) / props.coordinates.length
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.coordinates.length !== this.props.coordinates.length){
            this.setState({
                coordinates: this.props.coordinates,
                initialX: _.sumBy(this.props.coordinates, (point) => {return point.lat}) / this.props.coordinates.length,
                initialY: _.sumBy(this.props.coordinates, (point) => {return point.lng}) / this.props.coordinates.length
            });
        }
    }

    render() {
        return (
            <Map 
                google={this.props.google} 
                zoom={13} 
                initialCenter={{lat: this.state.initialX, lng: this.state.initialY}}
                center={{lat: this.state.initialX, lng: this.state.initialY}}
                style={mapStyles}>     
                <Polyline
                    path={this.state.coordinates}
                    strokeColor="#0000FF"
                    strokeOpacity={0.8}
                    strokeWeight={2} />
            </Map>
        );
    }
}
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyAcefUBiNkcmqNvy2LGZkHfqh8WNVj6J7I")
})(MapContainer)