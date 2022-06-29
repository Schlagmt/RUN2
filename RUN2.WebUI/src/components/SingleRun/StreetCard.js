import React, { Component } from 'react';
import { Row, Card, Col } from 'react-bootstrap';
import AreaChart from './AreaChart';
import _ from 'lodash'

export class StreetCard extends Component {
    constructor(props){
        super()
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

    elevationData () {
        return _.map(this.props.streetData, (point, index) => {
            return {
                y: point.Elevation,
                x: index
            }
        })
    }

    speedData () {
        return _.map(this.props.streetData, (point, index) => {
            return {
                y: point.Speed,
                x: index
            }
        })
    }

    timeTaken () {
        return Math.round(
            (Math.abs(
                Date.parse(this.props.streetData[0].Time) - Date.parse(this.props.streetData[this.props.streetData.length - 1].Time)
            ) / 60000) * 100
        ) / 100
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
                                    <p>Time: {this.timeTaken()} min</p>
                                </Row>
                            </Col>
                            <Col>
                                <AreaChart data={this.speedData()} minmax={this.props.speedMinMax} h={100} w={500}/>
                            </Col>
                            <Col auto>
                                {this.averageSpeed()}
                            </Col>
                            <Col>
                                <AreaChart data={this.elevationData()} minmax={this.props.elevationMinMax} h={100} w={500}/>
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