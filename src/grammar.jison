%{
    function add_var(name) {
        _vars_context.set(name, false);
    }

    function add_opt_node(optype, left_node, right_node) {
        return {
            type: 'NODE_OP',
            op: optype,
            left: left_node,
            right: right_node
        }
    }

    function add_var_node(str) {
        return { type: 'NODE_VAR', name: str };
    }

    function add_const_node(value) {
        return { type: 'NODE_CONST', t_val: value };
    }
%}

%lex

%option caseless
%%

"&"|"*"|"and"|"dan"     { return 'CONJ'; }
"|"|"+"|"or"|"atau"     { return 'DISJ'; }
"~"|"!"|"not"|"bukan"   { return 'NEG'; }
"->"|"=>"               { return 'IMP'; }
"="|"<->"|"<=>"         { return 'EQUV'; }
"("|"{"|"["             { return '('; }
")"|"}"|"]"             { return ')'; }
"1"[a-z]+|"0"[a-z]+     /* Ignore */
"true"|"benar"|"1"      { 
                            yylval = true;
                            return 'CONST'; 
                        }
"false"|"salah"|"0"     { 
                            yylval = false;
                            return 'CONST'; 
                        }
[a-z][a-z0-9_]*         { 
                            if (!_store_AST) _store_AST = true;
                            add_var(yytext);
                            yylval = yytext;
                            return 'VAR'; 
                        }
[0-9]+|[ \t\n]|.        /* Ignore */
<<EOF>>                 { return 'EOF'; }

/lex

%token 'EQUV' 'IMP'
%token 'DISJ' 'CONJ'
%token 'NEG' 'CONST' 'VAR'

%start Formula

%%
Formula     : Equivalance EOF { return $1; }
            ;
            
Equivalance : Equivalance EQUV Implication  
                {
                    if (_store_AST) $$ = add_opt_node('OP_EQUV', $1, $3);
                    else $$ = (!$1 || $3) && ($1 || !$3);
                }
            | Implication
            ;

Implication : Implication IMP Disjunction   
                {
                    if (_store_AST) $$ = add_opt_node('OP_IMP', $1, $3);
                    else $$ = (!$1 || $3)
                }
            | Disjunction
            ;

Disjunction : Disjunction DISJ Conjunction  
                {
                    if (_store_AST) $$ = add_opt_node('OP_DISJ', $1, $3);
                    else $$ = $1 || $3;
                }
            | Conjunction
            ;

Conjunction : Conjunction CONJ Negation     
                {
                    if (_store_AST) $$ = add_opt_node('OP_CONJ', $1, $3);
                    else $$ = $1 && $3
                }
            | Negation
            ;

Negation    : NEG Negation                  
                { 
                    if (_store_AST) $$ = add_opt_node('OP_NEG', $2, null);
                    else $$ = !$2; 
                }
            | Atomic
            ;

Atomic      : VAR                           { $$ = add_var_node(yylval); }    
            | CONST                         
                {
                    if (_store_AST) $$ = add_const_node(yylval);
                    else $$ = yylval;
                }
            | '(' Equivalance ')'           {$$ = $2}
            ;