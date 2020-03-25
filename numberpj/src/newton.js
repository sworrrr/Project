import React, { Component } from 'react';
import './newton.css';
import a3 from './ntls.png';
import 'antd/dist/antd.css';
import { Input } from 'antd';
import { Card, Row, Table, Form } from 'antd'
import { range, compile, evaluate, simplify, parse, abs ,derivative} from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
const PlotlyComponent = createPlotlyComponent(Plotly)
var dataInTable = []
var data = []
var fx = []
class bisect extends Component {
    componentDidMount() {
        fetch("/newton")
          .then(res => res.json())
          .then(json => {
            this.setState({ items: json });
          });
      }
    constructor() {
        super();
        this.state = { function: " ",Xstart: 0, X: 0, showGrap: false, showTable: false, items: [] }
        this.onChangefunction = this.onChangefunction.bind(this)
        this.onChangeVariableXstart = this.onChangeVariableXstart.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onExample = this.onExample.bind(this)
    }
    onChangefunction(func) {
        this.setState({ function: func.target.value })
        console.log(this.state.function);
    }
   
    onChangeVariableXstart = (event) => {
        this.setState({ Xstart: event.target.value })
    }
    onExample() {
        this.setState({ function: this.state.items.Function,
            Xstart: this.state.items.Xstart })
    }
    onSubmit() {
            dataInTable = []
            var sum = parseFloat(0.000000)
            var n = 0
            var xold,xnew, xs = this.state.Xstart
            var inputy = []
            inputy['xold'] = []
            inputy['xnew'] = []
            inputy['error'] = []

            /* ทำทิ้งเปล่า 1 ครั้ง */
            inputy['xold'][n] = parseFloat(xs)
            fx[n]=this.funcChange(xs)
            inputy['error'][n] = 1
            xold = xs-(this.funcChange(xs)/this.funcDiff(xs))
            inputy['xnew'][n] = xold
            /* loop ทำ Iteration*/
            do {
                inputy['xold'][n + 1] = xold
                fx[n+1]=this.funcChange(xold)
                xnew=xold-(this.funcChange(xold)/this.funcDiff(xold))
                inputy['xnew'][n+1]=xnew            
                sum = this.funcError(xnew, xold)
                xold=xnew
                inputy['error'][n + 1] = sum
                n++;
                /* console.log("Iteration"+n+" "+"xl:"+data['xl'][n]+" "+"xr:"+data['xr'][n]+" "+"xm:"+data['xm'][n]+" "+"error:"+sum)*/
            } while (sum > 0.000001)
            this.setState({ showGrap: true, showTable: true })
            this.Graph(inputy['xold'])
            this.createTable(inputy['xold'], inputy['xnew'], inputy['error']);
    
    }

    /* function เช็คว่า fx * fxm < 0 หรือ ไม่*/
    funcChange = (X) => { let scope = { x: parseFloat(X) }; var expr = compile(this.state.function); return expr.evaluate(scope) }
    /* function หาค่า Error*/
    funcError = (Xnew, Xold) => { return abs((Xnew - Xold) / Xnew) }
    /* function เอาค่าที่หาได้ยัดลง Array dataIntable*/
    funcDiff = (X) => {let scope = {x : parseFloat(X)};var expr = derivative(this.state.function,'x');return expr.evaluate(scope)}
    createTable(xold, xnew, error) {
        for (var i = 0; i < xold.length; i++) {
            dataInTable.push({
                iteration: i,
                x: xold[i],
                x1: xnew[i],
                error: error[i],
            });
        }
    }
    Graph(xold) {
        data = [
            {
                type: 'scatter',
                x: xold,
                y: fx,
                marker: {
                    color: 'rgb(150, 32, 77)'
                },
                name: 'X'
            },
            
            ];

    }
    render() {
        var fx = this.state.function
        let layout = {
            title: 'Bisection',
            xaxis: {
                title: 'X'
            }
        };
        let config = {
            showLink: false,
            displayModeBar: true
        };
        return (
            <div className="newton">
            <div className="bgnewton">
                <div className="nameconnewton"><img src={a3} width="500" height="160" /></div>
                <div className="example-inputfucnewton"><Input size="large"  placeholder={this.state.function} onChange={this.onChangefunction} /></div>
                <div className="example-inputxnewton"><Input size="large" placeholder={this.state.Xstart} onChange={this.onChangeVariableXstart} /></div>
                <div className="resetnewton"><a href="/newton">Reset</a></div>
                <div className="submitnewton" onClick={this.onSubmit}>Submit</div>
                <div className="apinewton"  onClick={this.onExample}>Example</div>
                <div className="homenewton" ><a href="/">Home</a></div>


            </div>
            <div>
                {this.state.showTable === true ?
                    <Card
                        title={"Output"}
                        bordered={true}
                        style={tablestyle}
                        id="outputCard"
                    >
                        <Table columns={columns} dataSource={dataInTable} bodyStyle={body}
                        ></Table>
                    </Card>
                    : ''}

                {/* Plot Graph*/}
                {this.state.showGrap === true ?
                    <PlotlyComponent data={data} Layout={layout} config={config} /> : ''
                }
            </div>
            </div>
        );
    }
}
export default bisect;
var Textstyle = {
    textAlign: 'center',
    textDecorationLine: 'underline'
}
var tablestyle =
{
    width:"100%", background: "black", color: "#2196f3", float: "inline-start", marginBlockStart: "2%"
}
var body = {
    fontWeight: "bold", fontSize: "18px", color: "#000033"
}
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "kiteration"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "kx"
    },
    {
        title: "Xnew",
        dataIndex: "x1",
        key: "kx1"
    },
    {
        title: "Error",
        key: "kerror",
        dataIndex: "error"
    }
];