import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapContainer from './MapContainer';
import { StreetCard } from './StreetCard';
import _ from 'lodash'

export class SingleRun extends Component {
    constructor(props){
        super()

        this.state = {
            highlightedCoordinates: null
        }
    }

    handleHighlightSection = (coordinates) => {
        this.setState({highlightedCoordinates: coordinates})
    }

    streetBreakdown() {
        var streetBreakdown = []
        var tempStreet = []
        _.forEach(this.props.run[1], (point) => {
            if (tempStreet.length === 0){
                tempStreet.push(point)
            }
            else {
                if (point.Street === tempStreet[0].Street){
                    tempStreet.push(point)
                }
                else {
                    streetBreakdown.push(tempStreet)
                    tempStreet = []
                    tempStreet.push(point)
                }
            }
        })

        var speedAverage = _.sumBy(this.props.run[1], (point) => { return point.Speed }) / this.props.run[1].length
        var speedMinMax = [
            _.minBy(this.props.run[1], (point) => { return point.Speed }).Speed,
            _.maxBy(this.props.run[1], (point) => { return point.Speed }).Speed,
        ]
        var elevationMinMax = [
            _.minBy(this.props.run[1], (point) => { return point.Elevation }).Elevation,
            _.maxBy(this.props.run[1], (point) => { return point.Elevation }).Elevation,
        ]

        return streetBreakdown.map((street) => {
            return ( 
                <Row key={speedAverage}>
                    <StreetCard handleHighlightSection={this.handleHighlightSection} streetData={street} speedAverage={speedAverage} speedMinMax={speedMinMax} elevationMinMax={elevationMinMax}></StreetCard>
                </Row>
            )
        })
    }

    render () {
        var coordinates = _.map(this.props.run[1], (point) => {
            return {lat: point.Latitude, lng: point.Longitude}
        })

        return (
            <Container fluid>
                <Row>
                    <h1>{this.props.run[0]}</h1>
                </Row>
                <Row style={{height: '100%'}}>
                    <Col>
                        <MapContainer coordinates={coordinates} highlight={this.state.highlightedCoordinates} />
                    </Col>
                    <Col className='street-card-container'>
                        {this.streetBreakdown()}
                    </Col>
                </Row>
            </Container>
        );
    }
}