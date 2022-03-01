// Should reset if parse new formula
var _vars_context = new Map();
var _var_row = [];
var _result_row = [];
var _store_AST = false;
var _ast;

function lookup_var_context(name) {
    return _vars_context.get(name);
}

function change_var_context(name, value) {
    _vars_context.set(name, value);
}

function eval_ast(ast) {
    if ('NODE_OP' === ast['type']) {
        let left = eval_ast(ast['left']), right;
        if (ast['op'] !== 'OP_NEG') right = eval_ast(ast['right']);

        switch (ast['op']) {
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
    } else if ('NODE_VAR' === ast['type'])
        return lookup_var_context(ast['name']);
    else return ast['t_val'];
}

function generate_truth_table() {
    let total_vars = _vars_context.size;
    let total_row = Math.pow(2, total_vars);

    for (let i = 0; i < total_row; i++) {
        let k = total_vars;
        let list_of_var = _vars_context.keys();
        for (let j = 0; j < total_vars; j++) change_var_context(list_of_var.next().value, Boolean((i >> --k) & 1));
        let clone_vars_context = new Map(_vars_context);
        _var_row.push(clone_vars_context);
        _result_row.push(eval_ast(_ast));
    }
}