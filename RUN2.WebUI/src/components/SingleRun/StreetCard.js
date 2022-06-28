import React, { Component } from 'react';
import { Row, Card, Col } from 'react-bootstrap';
import _ from 'lodash'

export class StreetCard extends Component {
    constructor(props){
        super()

        var speed = []
        var elevation = []
        _.forEach(props.streetData, (index, point) => {
            speed.push({
                xValue: point.Speed,
                yValue: index
            })
            elevation.push({
                xValue: point.elevation,
                yValue: index
            })
        })        

        this.state = {
            timeTaken: Math.round((Math.abs(Date.parse(props.streetData[0].Time) - Date.parse(props.streetData[props.streetData.length - 1].Time)) / 60000) * 100) / 100,
            speedData: speed,
            elevationData: elevation
        }
    }

    render () {
        return (
            <Card className='street-card'>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col>
                                <Row>
                                    <h5>{this.props.streetData[0].Street}</h5>
                                </Row>
                                <Row>
                                    <p>Time: {this.state.timeTaken} min</p>
                                </Row>
                            </Col>
                            <Col>
                                image
                            </Col>
                            <Col>
                                spped
                            </Col>
                            <Col>
                                elevation
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}