import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRunning } from '@fortawesome/free-solid-svg-icons';
import { HomePage } from './components/HomePage/HomePage';
import { AllRuns } from './components/AllRuns/AllRuns';
import { SingleRun } from './components/SingleRun/SingleRun';
import './App.css';
import _ from 'lodash';

export class App extends Component {
    constructor(){
        super()
        const context = require.context('../src/CleanData', true, /.json$/);
        const all = {};
        context.keys().forEach((key: any) => {
            const fileName = key.replace('./', '');
            const resource = require(`../src/CleanData/${fileName}`);
            const namespace = fileName.replace('.json', '');
            all[namespace] = JSON.parse(JSON.stringify(resource));
        });

        this.state = {
            runs: Object.entries(all),
            selectedRun: null
        }
    }

    getAllRunningFiles() {

        var areas = _.uniq(_.map(this.state.runs, (run) => {
            return run[0].substring(0, run[0].indexOf('Running') + 7)
        }))

        var masterList = _.map(areas, (area) => {
            return _.filter(this.state.runs, (run) => {
                return run[0].includes(area)
            })
        })

        return masterList.reverse().map((area) =>(
            <div>
                <Row className='navbar-links' key={area[0][0]}>
                    <button className='link-button'><span onClick={() => this.changeMainContent(area)}>- {area[0][0].substring(0, area[0][0].indexOf('Running')+7)}</span></button>
                </Row>
                {this.getAllSubRunningFiles(area)}
            </div>
            
        ))
    }

    getAllSubRunningFiles(runs) {
        return runs.reverse().map((run) =>(
            <Row className='navbar-links' key={run[0]}>
                <button className='link-button'><span onClick={() => this.changeMainContent(run)}>&emsp;&emsp;&emsp;- {run[0]}</span></button>
            </Row>
        ))
    }

    changeMainContent(value){
        this.setState({selectedRun: value});
        this.mainPage();
    }

    mainPage(){
        if (this.state.selectedRun === null){
            return (
                <HomePage></HomePage>
            )
        }
        else if (typeof(this.state.selectedRun[0]) !== 'string'){
            return (
                <AllRuns runs={this.state.runs}></AllRuns>
            )
        }
        else {
            return (
                <div key={this.state.selectedRun[0]}>
                    <SingleRun run={this.state.selectedRun}></SingleRun>
                </div>
            )
        }
    }

    render () {
        return (
            <Container fluid>
                <Row>
                    <Col md={2} className='d-flex flex-column vertical-navbar'>
                        <Row style={{marginTop: '1em'}}>
                            <button className='link-button header-button'><h1 onClick={() => this.changeMainContent(null)}>RUN2 <FontAwesomeIcon icon={faRunning} style={{color: 'white'}}/></h1></button>
                        </Row>
                        {this.getAllRunningFiles()}
                    </Col>
                    <Col md={10} className='d-flex flex-column main-content'>
                        {this.mainPage()}
                    </Col>
                </Row>
            </Container>
        );
    }
}