import React, { Component } from 'react';
import './bisect.css';
import a2 from './bisecttitle.png';
import 'antd/dist/antd.css';
import { Input } from 'antd';
import { Card, Row, Table, Form } from 'antd'
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs';
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
const PlotlyComponent = createPlotlyComponent(Plotly)
var dataInTable = []
var data = []
var fxr = [], fxl = []
class bisect extends Component {
    componentDidMount() {
        fetch("/bisect")
          .then(res => res.json())
          .then(json => {
            this.setState({ items: json });
          });
      }
    constructor() {
        super();
        this.state = { function: " ", Xr: 0, Xl: 0, X: 0, showGrap: false, showTable: false,items: [] }
        this.onChangefunction = this.onChangefunction.bind(this)
        this.onChangeVariableXr = this.onChangeVariableXr.bind(this)
        this.onChangeVariableXl = this.onChangeVariableXl.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onExample = this.onExample.bind(this)
    }
    onChangefunction(func) {
        this.setState({ function: func.target.value })
        console.log(this.state.function);
    }
    onChangeVariableXr = (event) => {
        this.setState({ Xr: event.target.value })
    }
    onChangeVariableXl = (event) => {
        this.setState({ Xl: event.target.value })
    }
    onExample() {
        this.setState({ function: this.state.items.Function,
            Xl: this.state.items.XL,
            Xr: this.state.items.XR })
    }
    onSubmit() {
        if (this.state.Xl < this.state.Xr) {
            dataInTable = []
            var sum = parseFloat(0.000000)
            var increaseFunction = false
            var n = 0
            var xm, xl = this.state.Xl, xr = this.state.Xr
            var inputy = []
            inputy['xl'] = []
            inputy['xm'] = []
            inputy['xr'] = []
            inputy['error'] = []

            /* ทำทิ้งเปล่า 1 ครั้ง */
            inputy['xl'][n] = parseFloat(xl)
            inputy['xr'][n] = parseFloat(xr)
            xm = (parseFloat(xl) + parseFloat(xr)) / 2
            inputy['xm'][n] = xm
            inputy['error'][n] = 1
            fxr[n] = this.funcChange(xr)
            fxl[n] = this.funcChange(xl)
            increaseFunction = (((fxr[n]) * this.funcChange(xm)) < 0 ? true : false)
            if (increaseFunction) {
                xl = xm
            }
            else {
                xr = xm
            }

            /* console.log("Iteration"+n+" "+"xl:"+data['xl'][n]+" "+"xr:"+data['xr'][n]+" "+"xm:"+data['xm'][n]+" "+"error:"+data['error'][n])*/

            /* loop ทำ Iteration*/
            do {
                inputy['xl'][n + 1] = parseFloat(xl)
                inputy['xr'][n + 1] = xr
                xm = (parseFloat(xl) + parseFloat(xr)) / 2
                fxr[n + 1] = this.funcChange(inputy['xr'][n + 1])
                fxl[n + 1] = this.funcChange(inputy['xl'][n + 1])
                increaseFunction = (((fxr[n + 1]) * this.funcChange(xm)) < 0 ? true : false)
                if (increaseFunction) {
                    xl = xm
                }
                else {
                    xr = xm
                }
                sum = this.funcError(xm, inputy['xm'][n])
                inputy['xm'][n + 1] = xm
                inputy['error'][n + 1] = sum
                n++;
                /* console.log("Iteration"+n+" "+"xl:"+data['xl'][n]+" "+"xr:"+data['xr'][n]+" "+"xm:"+data['xm'][n]+" "+"error:"+sum)*/
            } while (sum > 0.000001)
            this.setState({ showGrap: true, showTable: true })
            this.Graph(inputy['xl'], inputy['xr'])
            this.createTable(inputy['xl'], inputy['xr'], inputy['xm'], inputy['error']);
        }
        /* กรณี inputไม่ถูก*/
        else {
            console.log("Please Input Xl > Xr")
        }
    }

    /* function เช็คว่า fx * fxm < 0 หรือ ไม่*/
    funcChange = (X) => { let scope = { x: parseFloat(X) }; var expr = compile(this.state.function); return expr.evaluate(scope) }
    /* function หาค่า Error*/
    funcError = (Xnew, Xold) => { return abs((Xnew - Xold) / Xnew) }
    /* function เอาค่าที่หาได้ยัดลง Array dataIntable*/
    createTable(xl, xr, xm, error) {
        for (var i = 0; i < xl.length; i++) {
            dataInTable.push({
                iteration: i,
                xl: xl[i],
                xr: xr[i],
                xm: xm[i],
                error: error[i],
            });
        }
    }
    Graph(xl, xr) {
        data = [
            {
                type: 'scatter',
                x: xl,
                y: fxl,
                marker: {
                    color: 'rgb(150, 32, 77)'
                },
                name: 'XL'
            },
            {
                type: 'scatter',
                x: xr,
                y: fxr,
                marker: {
                    color: '#ffab00'
                },
                name: 'XR'
            }];

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
            <div className="bisect">
            <div className="bgbisect">
                <div className="nameconB"><img src={a2} width="450" height="260" /></div>
                <div className="example-inputfucB"><Input size="large" placeholder={this.state.function} onChange={this.onChangefunction} /></div>
                <div className="example-inputxlB"><Input size="large" placeholder={this.state.Xl} onChange={this.onChangeVariableXl}></Input></div>
                <div className="example-inputxrB"><Input size="large" placeholder={this.state.Xr} onChange={this.onChangeVariableXr}></Input></div>
                <div className="resetB" ><a href="/bisect">Reset</a></div>
                <div className="submitB" onClick={this.onSubmit}>Submit</div>
                <div className="apibisect"  onClick={this.onExample}>Example</div>
                <div className="homebisect" ><a href="/">Home</a></div>

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
        title: "XL",
        dataIndex: "xl",
        key: "kxl"
    },
    {
        title: "XR",
        dataIndex: "xr",
        key: "kxr"
    },
    {
        title: "Xm",
        dataIndex: "xm",
        key: "kxm"
    },
    {
        title: "Error",
        key: "kerror",
        dataIndex: "error"
    }
];