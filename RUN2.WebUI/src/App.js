import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRunning } from '@fortawesome/free-solid-svg-icons';
import { HomePage } from './components/HomePage';
import { AllRuns } from './components/AllRuns';
import { SingleRun } from './components/SingleRun';
import _ from 'lodash';
import './App.css';

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

        return this.state.runs.map((run) =>(
            <Row className='navbar-links' key={run[0]}>
                <a href='javascript:void(0)'><span onClick={() => this.changeMainContent(run)}>{run[0]}</span></a>
            </Row>
        ))
    }

    changeMainContent(value){
        this.setState({selectedRun: value});
        this.mainPage();
    }

    mainPage(){
        if (this.state.selectedRun == null){
            return (
                <HomePage></HomePage>
            )
        }
        else if (this.state.selectedRun == 'All'){
            return (
                <AllRuns runs={this.state.runs}></AllRuns>
            )
        }
        else {
            return (
                <SingleRun run={this.state.selectedRun}></SingleRun>
            )
        }
    }

    render () {
        return (
            <Container fluid>
                <Row>
                    <Col md={2} className='d-flex flex-column vertical-navbar'>
                        <Row style={{textAlign: 'center'}}>
                            <a href='javascript:void(0)'><h1 onClick={() => this.changeMainContent(null)}>RUN2 <FontAwesomeIcon icon={faRunning} style={{color: 'white'}}/></h1></a>
                        </Row>
                        <Row className='navbar-links'>
                            <a href='javascript:void(0)'><span onClick={() => this.changeMainContent('All')}>All</span></a>
                        </Row>
                        {this.getAllRunningFiles()}
                    </Col>
                    <Col md={10} className='d-flex flex-column'>
                        {this.mainPage()}
                    </Col>
                </Row>
            </Container>
        );
    }
}