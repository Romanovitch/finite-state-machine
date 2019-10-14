class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        if (!config) {throw new Error()};
        this.history = [{step: 0, start: "", end: "normal", undo: false}];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentStep().end;
    }

    currentStep() {
        const  currentSteps = this.history.filter(el => el.undo === false);
        return currentSteps[currentSteps.length - 1];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.config.states.hasOwnProperty(state)){
            this.history = this.history.concat(
                {
                    step: ++this.currentStep().step,
                    start: this.currentStep().end,
                    end: state,
                    undo: false,
                });
            this.history = this.history.filter(el => el.undo !== true);
        } else {
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const nextState = this.config.states[this.currentStep().end].transitions[event];
        if(nextState){
            this.changeState(nextState);
        } else {
            throw new Error();
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {return Object.getOwnPropertyNames(this.config.states)}        
        const resArr = Object.getOwnPropertyNames(this.config.states)
            .filter(iState => 
                Object.getOwnPropertyNames(this.config.states[iState].transitions)
                .some(iEvent => iEvent === event)
            );
            return (resArr.length) ? resArr : [];
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        const thisRecord = this.currentStep();
        if (thisRecord.start) {
            if (thisRecord.end !== thisRecord.start) {
                thisRecord.undo = true;
                return true;
            } 
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        const firstUndoStep = this.history.filter(el => el.undo === true)[0];
        if (firstUndoStep) {
            firstUndoStep.undo = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [{step: 0, start: "", end: "normal", undo: false}];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
