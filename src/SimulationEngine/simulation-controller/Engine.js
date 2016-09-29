import * as _ from 'lodash';
import * as THREE from 'three';
import VariableInterval from '../simulation-model/world/world_config_models/VariableInterval'
import TimeModel from '../simulation-model/world/world_config_models/TimeModel'
import dat from '../utils/dat/index'

export default class Engine { 
    constructor() {
        this.initialize();
    }

    initialize() { 
        this.eventLog = [];
        this.currentEvent;
        this.previousEvent;
        this.variableInterval = new VariableInterval(this);    
    }

    initializeModel(stateSpace, simulation) {
        this.initialize();
        this.stateSpace = stateSpace;
        this.simulation = simulation;
        this.simulation.initializeModel(this.stateSpace);
    }

    // refer to initializeModel above
    _setSimulationUpdateFunction() { 
// Update simulation model START: *************************

/*
    The Model and Controller are updated in the variableInterval for more precise timing between updates (not system dependent)
    using a setTimeout that is set and reset in the variableInterval loop. The render function set and updated in the View is used for 
    updating controls, and later, dynamics. The variableInterval loop is suitable for kinematic and general system decisions
    that are not dependent on the state of every frame. In other words, variableInterval loop is best used for modeling decisions
    at SPECIFIC moments in time over the life of the simulation (discrete event processes), whereas the render loop (as made 
    available by the DOM animationFrame) is best suited for modeling decisions made at EVERY moment in time over the life of the 
    simulation (continuous event processes). 
*/
            
        // IMPORTANT: Run headless simulation here
        // Rendering is handled separately in the view in the render loop
        // Engine is comparable to gzserver, whereas the View is comparable to gzclient

        var simulationUpdateFunction = function() { 
        
        // Update simulation model from controls START: *************************

            this._updateControls();

        // Update simulation model from controls END: *************************

        // Update simulation model from event execution logic START: *************************

            this._updateStateSpace();

        // Update simulation model from event execution logic END: *************************
/*
            // Stop simulation if exceed systemTimeLimit
            if (this.stateSpace.systemTime > this.stateSpace.systemTimeLimit) {
                if (this.stateSpace.reportGeneratorFunction) { 
                    var simulationReport = this.generateSimulationReport(this.stateSpace.reportGeneratorFunction);

                    // TODO: do something with simulation report
                    this.stateSpace.eventLog = simulationReport;
                }
                // this.variableInterval.stop();
                return 0; 
            }
*/
            // return the incremented time [timing] in ms of the next variable interval iteration
            return this.simulation.timeModel.AGENT_UPDATE_INTERVAL;
            // *************************
        }


        // initialize variable interval
        // [setVariableInterval( callbackFn , timing )]
        // <-- timing (in ms)
        this.variableInterval.setVariableInterval(simulationUpdateFunction.bind(this), this.simulation.timeModel.AGENT_UPDATE_INTERVAL);
        
        // Update simulation model END: *************************
    }

    _updateControls() {
        this.simulation.updateControls(this.stateSpace);
    }

    _updateStateSpace() { 
        this.simulation.updateStateSpace(this.simulation.timeModel.AGENT_UPDATE_FREQUENCY, this.stateSpace);
    }

    // insert and configure dat.GUI AFTER model is initialized (this.initializeModel)
    // for primary user view
    initializeControls() {
        this.simulation.initializeControls(this.stateSpace);
    }

    destroyControls() {
        if (this.stateSpace.view.gui) { 
            this.stateSpace.view.gui.destroy();
        }
    }

    runSimulation() {

        this._setSimulationUpdateFunction();
        // start simulation by starting the execution of the variable interval
        this.variableInterval.start();
    }

    stopSimulation() { 
        this.variableInterval.stop();
    }

    // immediately executes an event
    executeEvent(eventId, executionTime, data) {
        this.eventGenerator.executeEvent(eventId, executionTime, data);
    }

    // adds a bounded event to the event queue to be executed during simulation
    generateEvent(eventId, executionTime, data) {
        this.eventGenerator.generateEvent(eventId, executionTime, data);
    }

    // update system time to the execution time of the given event
    updateSystemTime(event) {
        console.log(event);
        this.stateSpace.systemTime = event.executionTime;
    }

    // display and collect executed event information
    logEvent(event) {
        this.eventLog.push(event);

    /*
        console.log("EXECUTED EVENT: " + event.eventId);
        console.log("SYSTEM TIME: " + this.stateSpace.systemTime);
        console.log("SYSTEM MESSAGE: " + this.stateSpace.message);
        console.log("VEHICLE ACC.: ");
        console.log(this.stateSpace.vehicle.a);
        console.log("CURRENT EVENT: ");
        console.log(this.currentEvent);
        console.log("PREVIOUS EVENT: ")
        console.log(this.previousEvent);
        console.log("QUEUE SIZE: ")
        console.log(this.stateSpace.eventQueue.length);
        console.log(" ");
        console.log(" ");
*/
    }

    // processes and packages eventLog and other data
    generateSimulationReport(reportGeneratorFunction) {
        debugger;
        
        console.log("Simulation report: ");
        console.log(this.eventLog);

        var data;
        if (reportGeneratorFunction) { 
            data = reportGeneratorFunction();
        }

        return {
            data: data,
            eventLog: this.eventLog
        } 
    }
}