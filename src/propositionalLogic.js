var symbolTable = new Map();    // Don't change anything from this line!

class PropositionalLogic {
    #varRowContext = [];
    #resultRow = [];
    #ast = null;

    constructor() {
        this.#resetVars();
    }

    #resetVars() {
        symbolTable = new Map();    // global variable
        this.#varRowContext = [];
        this.#resultRow = [];
        this.#ast = null;
    }

    #getVarContext(name) {
        return symbolTable.get(name);
    }
    
    #setVarContext(name, value) {
        symbolTable.set(name, value);
    }

    getVarRowContext() {
        return this.#varRowContext;
    }

    getResultRow() {
        return this.#resultRow;
    }

    getResult() {
        return this.#ast['t_val'];
    }

    itsGeneratedAST() {
        return this.#ast['type'] !== 'NODE_CONST';
    }

    //  1 : Tautology
    //  0 : Contingency
    // -1 : Contradiction
    getStatementType() {
        if (this.itsGeneratedAST()) {
            let totalTrue = 0, totalFalse = 0;
            for (let i = 0; i < this.#resultRow.length; i++) {
                if (this.#resultRow[i]) totalTrue++;
                else totalFalse++;
            }
            if (totalFalse === 0) return 1;
            else if (totalTrue === 0) return -1;
            else if (totalTrue !== 0 && totalFalse !== 0) return 0;
        } else {
            return this.#ast ? 1 : -1;
        }
    }

    #evalAST(node) {
        if ('NODE_OP' === node['type']) {
            let left = this.#evalAST(node['left']), right;
            if (node['op'] !== 'OP_NEG') right = this.#evalAST(node['right']);
    
            switch (node['op']) {
                case 'OP_NEG':
                    return !left;
                case 'OP_CONJ':
                    return left && right;
                case 'OP_DISJ':
                    return left || right;
                case 'OP_IMP':
                    return !left || right;
                case 'OP_EQUV':
                    return (!left || right) && (left || !right);
            }
        } else if ('NODE_VAR' === node['type'])
            return this.#getVarContext(node['name']);
        else return node['t_val'];
    }

    eval(expr) {
        this.#resetVars();
        this.#ast = grammar.parse(expr);
        if (this.itsGeneratedAST()) this.#generateTruthTable(); 
    }

    #generateTruthTable() {
        let totalVar = symbolTable.size;
        let totalRow = Math.pow(2, totalVar);

        for (let i = 0; i < totalRow; i++) {
            let k = totalVar;
            let listOfVar = symbolTable.keys();
            for (let j = 0; j < totalVar; j++) this.#setVarContext(listOfVar.next().value, Boolean((i >> --k) & 1));
            let cloneVarRowContext = new Map(symbolTable);
            this.#varRowContext.push(cloneVarRowContext);
            this.#resultRow.push(this.#evalAST(this.#ast));
        }
    }
}