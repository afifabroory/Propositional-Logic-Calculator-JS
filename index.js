const {
    Container,
    InputBase,
    Paper,
    IconButton,
    Icon,
    createTheme,
    ThemeProvider,
    Collapse,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} = MaterialUI;

const InputTheme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    "&:focus-within": {
                        boxShadow: "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)"
                    }
                }
            }
        }
    }
})


function App() {
    const [checked, setChecked] = React.useState(false);
    const [isOK, areUOK] = React.useState(false);
    const [vars, setVar] = React.useState([]);

    let isNotError = false;

    const table_output = () => {
        let header_column = [...vars.keys()];
        let expr_value = document.getElementById('main').value.toUpperCase();

        const BodyTable = () => {
            const Readable = (v) => {
                return v ? "T" : "F";
            }

            const Row = () => {
                let id = 0;
                return _var_row.map((e, i) => {
                    let col = [...e.values()].map(e2 => {
                        return <TableCell key={id++} align="center">{Readable(e2)}</TableCell>
                    });
                    col = col.concat(<TableCell key={id++} align="center">{Readable(_result_row[i])}</TableCell>);
                    return <TableRow key={id++}>{col}</TableRow>
                    
                })
            }

            return (<TableBody>
                <Row />
            </TableBody>)
        }

        header_column.push(expr_value);
        return (
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {header_column.map(e => <TableCell key={e} align="center">{e}</TableCell>)}
                    </TableRow>
                </TableHead>
                <BodyTable />
            </Table>
        );
    }

    const handleResultOnClick = () => {
        try {
            setChecked(true);
            let expr_value = document.getElementById('main').value;
            eval_expr(expr_value);
            setVar(_vars_context);
            areUOK(true);
            setChecked(false);
        } catch (err) {
            areUOK(false);
        }
    };

    const handleResultOnEnter = (e) => {
        if (e.key === 'Enter') {
            try {
                let expr_value = document.getElementById('main').value;
                setChecked(true);
                eval_expr(expr_value);
                setVar(_vars_context);
                areUOK(true);
            } catch (err) {
                areUOK(false);
            };
        }
    };

    function Output() {
        if (!isOK) return (<h3 style={{
            textAlign: 'center'
        }}>Sorry, we cannot understand your input. Please check again.</h3>);
        else return table_output();
    }

    const Main = (
        <ThemeProvider theme={InputTheme}>
            <Paper elevation={0} autoComplete="off" sx={{
                border: 0.1,
                borderColor: '#B6B6B6',
                p: '6px 0px',
                width: '100%',
                maxWidth: 650,
                display: 'flex'
            }}>
                <InputBase autoFocus fullWidth id="main" placeholder="Enter An Expression" onKeyDown={handleResultOnEnter} sx={{ ml: 2 }} />
                <IconButton color="primary" size="small" onClick={handleResultOnClick} sx={{ mr: 1 }}>
                    <Icon>calculaterounded</Icon>
                </IconButton>
            </Paper>
        </ThemeProvider>
    );

    return (
        <Container sx={{
            height: '100%',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }} >
            {Main}
            <Collapse in={checked} sx={{
                width: '100%',
                maxWidth: 650,
                p: '6px 0px',
                mt: 2
            }}>
                <Paper elevation={3} sx={{
                    border: 0.1,
                    borderColor: '#B6B6B6'
                }}>
                    <Output />
                </Paper>
            </Collapse>
        </Container>
    );
}


ReactDOM.render(
    <App />,
    document.querySelector('#root')
);