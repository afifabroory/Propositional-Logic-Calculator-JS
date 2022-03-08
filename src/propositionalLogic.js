var symbolTable = new Map();

class PropositionalLogic {
    #varRowContext = [];
    #resultRow = [];
    #ast = null;

    constructor() {}

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
        this.#ast = grammar.parse(expr);
        this.#generateTruthTable();
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