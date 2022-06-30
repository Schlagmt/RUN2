import _ from 'lodash';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapContainer from '../Shared/MapContainer';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export class AllRuns extends Component {
    constructor(props){
        super()

        var routeBreakdown = _.map(props.runs, (run) => {return run[1]})
        
        var pointBreakdown = _.map([].concat.apply([], routeBreakdown), (point) => { return {'Street': point.Street, 'Distance': point.Distance, 'Speed': point.Speed}})
        var streets = _.groupBy(pointBreakdown, (point) => {return point.Street})
        pointBreakdown = _.map(streets, (street, id) => ({
                'Street': id,
                'Distance': Math.round(_.sumBy(street, (point) => { return point['Distance'] }) * 100) / 100,
                'Speed': Math.round(_.sumBy(street, (point) => { return point['Speed'] }) / street.length  * 100) / 100,
            }))

        this.state = {
            routeBreakdown: [routeBreakdown],
            rowData: pointBreakdown,
            columnDefs: [
                {field: 'Street', sortable: true},
                {field: 'Distance', filter: 'agNumberColumnFilter', sortable: true},
                {field: 'Speed', filter: 'agNumberColumnFilter', sortable: true}
            ]
        }
    }

    render () {
        return (
            <Container fluid>
                <Row>
                    <h1>{this.props.runs[0][0].substring(0, this.props.runs[0][0].indexOf('Running') + 7)}</h1>
                </Row>
                <Row>
                    <Col>
                        <MapContainer coordinates={this.state.routeBreakdown} highlightedSection={null} />
                    </Col>
                    <Col>
                        <div className="ag-theme-alpine street-grid-container">
                            <AgGridReact
                                rowData={this.state.rowData}
                                columnDefs={this.state.columnDefs}>
                            </AgGridReact>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}