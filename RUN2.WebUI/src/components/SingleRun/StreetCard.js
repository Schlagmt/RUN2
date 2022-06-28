import React, { Component } from 'react';
import { Row, Card, Col } from 'react-bootstrap';
import AreaChart from './AreaChart';
import _ from 'lodash'

export class StreetCard extends Component {
    constructor(props){
        super()

        var speed = []
        var elevation = []
        var coordinates = []
        var index = 0
        _.forEach(props.streetData, (point) => {
            speed.push({
                y: point.Speed,
                x: index
            })
            elevation.push({
                y: point.Elevation,
                x: index
            })
            coordinates.push({
                x: point.Latitude,
                y: point.Longitude
            })
            index += 1
        })        

        this.state = {
            timeTaken: Math.round((Math.abs(Date.parse(props.streetData[0].Time) - Date.parse(props.streetData[props.streetData.length - 1].Time)) / 60000) * 100) / 100,
            speedData: speed,
            elevationData: elevation,
            coordinates: coordinates
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.streetData[0].Time !== this.props.streetData[0].Time){
            var speed = []
            var elevation = []
            var coordinates = []
            var index = 0
            _.forEach(this.props.streetData, (point) => {
                speed.push({
                    y: point.Speed,
                    x: index
                })
                elevation.push({
                    y: point.Elevation,
                    x: index
                })
                coordinates.push({
                    y: point.Latitude,
                    x: point.Longitude
                })
                index += 1
            })   
            this.setState({
                timeTaken: Math.round((Math.abs(Date.parse(this.props.streetData[0].Time) - Date.parse(this.props.streetData[this.props.streetData.length - 1].Time)) / 60000) * 100) / 100,
                speedData: speed,
                elevationData: elevation,
                coordinates: coordinates
            })
        }
    }

    averageElevation() {
        var start = this.props.streetData[0].Elevation
        var end = this.props.streetData[this.props.streetData.length - 1].Elevation
        var clean = Math.round(Math.abs(end - start) * 100) / 100
        if (end > start){
            return (
                <p>
                    + {clean}
                </p>
            )
        }
        else {
            return (
                <p>
                    - {clean}
                </p>
            )
        }
    }

    averageSpeed () {
        var streetAverage = _.sumBy(this.props.streetData, (point) => {return point.Speed }) / this.props.streetData.length
        var cleanValue = Math.round(Math.abs(streetAverage - this.props.speedAverage) * 100) / 100
        if (streetAverage > this.props.speedAverage){
            return (
                <p>
                    + {cleanValue}
                </p>
            )
        }
        else {
            return (
                <p>
                    - {cleanValue}
                </p>
            )
        }
    }

    render () {
        return (
            <Card className='street-card'>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col md={2}>
                                <Row>
                                    <h5>{this.props.streetData[0].Street}</h5>
                                </Row>
                                <Row>
                                    <p>Time: {this.state.timeTaken} min</p>
                                </Row>
                            </Col>
                            <Col>
                                <AreaChart data={this.state.speedData} h={100} w={500}/>
                            </Col>
                            <Col auto>
                                {this.averageSpeed()}
                            </Col>
                            <Col>
                                <AreaChart data={this.state.elevationData} h={100} w={500}/>
                            </Col>
                            <Col auto>
                                {this.averageElevation()}
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}