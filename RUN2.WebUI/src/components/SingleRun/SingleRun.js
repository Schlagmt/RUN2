import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapContainer from '../Shared/MapContainer';
import { StreetCard } from './StreetCard';
import _ from 'lodash'

export class SingleRun extends Component {
    constructor(props){
        super()

        var streetBreakdown = []
        var tempStreet = []
        _.forEach(props.run[1], (point) => {
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

        this.state = {
            highlightedSection: null,
            streetBreakdown: streetBreakdown
        }
    }

    handleHighlightedSection = (value) => {
        this.setState({highlightedSection: value})
    }

    streetBreakdown() {

        var speedAverage = _.sumBy(this.props.run[1], (point) => { return point.Speed }) / this.props.run[1].length
        var speedMinMax = [
            _.minBy(this.props.run[1], (point) => { return point.Speed }).Speed,
            _.maxBy(this.props.run[1], (point) => { return point.Speed }).Speed,
        ]
        var elevationMinMax = [
            _.minBy(this.props.run[1], (point) => { return point.Elevation }).Elevation,
            _.maxBy(this.props.run[1], (point) => { return point.Elevation }).Elevation,
        ]

        return this.state.streetBreakdown.map((street) => {
            return ( 
                <Row key={window.getRandomKey()}>
                    <StreetCard 
                        handleHighlightedSection={this.handleHighlightedSection} 
                        streetData={street} 
                        speedAverage={speedAverage} 
                        speedMinMax={speedMinMax} 
                        elevationMinMax={elevationMinMax}>
                    </StreetCard>
                </Row>
            )
        })
    }

    render () {
        return (
            <Container fluid>
                <Row>
                    <h1>{this.props.run[0]}</h1>
                </Row>
                <Row>
                    <Col>
                        <MapContainer coordinates={[this.state.streetBreakdown]} highlightedSection={this.state.highlightedSection} />
                    </Col>
                    <Col className='street-card-container'>
                        {this.streetBreakdown()}
                    </Col>
                </Row>
            </Container>
        );
    }
}