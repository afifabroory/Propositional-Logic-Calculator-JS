// ReactDOM.render(<h1>Hello, World!</h1>, document.querySelector("#root"))
// var header = document.createElement("h1")
// header.textContent = 'Hello, World!'
// header.className = 'header'
// document.querySelector("#root").appendChild(header);

// function Navbar() {
//     return (<ul>
//         <li><a href="google.com">Home</a></li>
//         <li><a href="google.com">News</a></li>
//         <li><a href="google.com">Contact</a></li>
//         <li><a href="google.com">About</a></li>
//     </ul>)
// }

// function MainContent() {
//     return <h1>Russia Won War!</h1>
// }

// ReactDOM.render(
//     <div>
//         <Navbar />
//         <MainContent />
//     </div>, 
//     document.querySelector('#root')
// );

const {
    Container,
    InputBase,
    Paper,
    IconButton,
    Icon,
    createTheme,
    ThemeProvider,
    Collapse
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
    const [expr, setExpr] = React.useState('');

    const handleResultOnClick = () => {
        setChecked(false);
        eval_expr(expr);
        setTimeout(() => setChecked(true), 800);
    };

    const handleResultOnEnter = (e) => {
        if (e.key === 'Enter') {
            setChecked(false);
            eval_expr(expr);
            setTimeout(() => setChecked(true), 800);
        }
    };

    const handleChange = (e) => {
        setExpr(e.target.value);
    }

    return (
        <Container sx={{ 
            height: '100%', 
            borderRadius:2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
            }} >
          <ThemeProvider theme={InputTheme}>
              <Paper elevation={0} sx={{
                  border: 0.1,
                  borderColor: '#B6B6B6',
                  p: '6px 0px',
                  width: '100%',
                  maxWidth: 650,
                  display: 'flex'
              }}>
                  <InputBase autoFocus fullWidth placeholder="Enter An Expression" onKeyDown={handleResultOnEnter} onChange={handleChange} sx={{ ml: 2 }} />
                  <IconButton color="primary" size="small" onClick={handleResultOnClick} sx={{ mr: 1 }}>
                      <Icon>calculaterounded</Icon>
                  </IconButton>
              </Paper>
          </ThemeProvider>
      
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
                  <h3 style={{
                      textAlign: 'center'
                  }}>This is h3 inside parent Paper and ancestor Collapse</h3>
              </Paper>
          </Collapse>
        </Container>
    );
}


ReactDOM.render(
    <App />,
    document.querySelector('#root')
);