// It took me a few days and a lot of tries to get it right
// I am sure it's patchy and sucky, but I'm quite happy that i was able to finish it
// this is how it works
//    Use clickButton() method to only accept the right sequence of input
//    Change that input into an array of alternating Keys and symbols
//    Use solveDoubleMinus() method to  get rid of second minus signs and turn the following number into a negative
//    Use calculate() method to reduce the formatted into a number
//    Use the displayAnswer() method linked to the 'Equals' sign to display the answer
//    P.S. I hate CSS!!

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Keys from "./components/keys";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      str: "",
      output: 0,
      calc: false,
    };
    this.clear = this.clear.bind(this);
    this.solveDoubleMinus = this.solveDoubleMinus.bind(this);
    this.calculate = this.calculate.bind(this);
    this.clickButton = this.clickButton.bind(this);
    this.displayAnswer = this.displayAnswer.bind(this);
  }
  clear() {
    this.setState({
      input: "",
      str: "",
      output: 0,
      calc: false,
    });
  }

  solveDoubleMinus(arr) {
    // this function will turn strings like '23' into Keys like 23
    // will also get rid of two minus signs in a row and make the following number a negative number
    // eg. ['23', '+', '3','-','-','69'] ===> [23, '+', 3, '-', -69]
    // need this for to be able to pass array to this.calculate() method

    return arr.reduce((a, c, i, arr) => {
      if (c === "-" && "+-x/".indexOf(arr[i - 1]) > -1) {
        return a;
      } else if (arr[i - 1] === "-" && "+-x/".indexOf(arr[i - 2]) > -1) {
        return a.concat(parseFloat(c) * -1);
      } else {
        return "+-x/".indexOf(c) === -1 ? a.concat(parseFloat(c)) : a.concat(c);
      }
    }, []);
  }

  calculate(arr) {
    // this funciton will reduce an array of Keys and symbols (+-x/) into a number
    // this funciton will not work with a number as the last element of an array
    // I have decided to just append a '+' at the end of an array when calling this method on it instead of trying to find a solution :(
    let signp = "+"; // use signp for addition and substraction
    let signx = "x"; // use signx for multiplicaton and division
    let temp = 1;
    let total = 0;
    const func = (uno, sign, dos) => {
      switch (sign) {
        case "+":
          return uno + dos;
        case "-":
          return uno - dos;
        case "x":
          return uno * dos;
        case "/":
          return uno / dos;
        default:
        // pass: Hopefully it wont come to this!!
      }
    };

    for (let i = 0; i < arr.length; i = i + 2) {
      if (arr[i + 1] === "+" || arr[i + 1] === "-") {
        temp = func(temp, signx, arr[i]);
        total = func(total, signp, temp);
        signp = arr[i + 1];
        signx = "x";
        temp = 1;
      } else {
        temp = func(temp, signx, arr[i]);
        signx = arr[i + 1];
      }
    }
    return total;
  }

  clickButton(val) {
    // this method is linked to all the Keys and symbold except for 'Clear' and 'Equals'
    // it will only allow appropriate input to be sent for later calculation
    // eg. 2+++++----***// will be interpreted as 2 /
    // it edited a million times to pass FCC user stories, but i am sure there are still bugs

    const str_ = this.state.str;
    const input_ = this.state.input;
    const output_ = this.state.output;
    const calc_ = this.state.calc;
    const last_char = input_[input_.length - 1];
    const last_char2 = input_[input_.length - 2];

    if (calc_ === true && "+-x/".indexOf(val) > -1) {
      this.setState((state) => ({
        input: state.output.toString(),
        calc: false,
        str: "",
        output: 0,
      }));
    }

    if (input_ === "" && "+-x/".indexOf(val) > -1) {
      // start the next calculation with the output of last one as the first input
      this.setState((state) => ({
        input: output_.toString().concat(val),
      }));
    } else {
      if (str_ === "") {
        if (val === 0) {
          // pass: do not accept zeros in the beginning of a number
        } else if (val === ".") {
          // prepend a decimal with a zero
          this.setState((state) => ({
            input: state.input.concat("0."),
            str: "0.",
          }));
        } else if ("+-x/".indexOf(val) > -1 && "+-x/".indexOf(last_char) > -1) {
          // if two operands in a row, accpet the last one (except for minus)
          if ("+-x/".indexOf(last_char2) > -1) {
            this.setState((state) => ({
              // this is the tricky part of user story # 13
              input: state.input.slice(0, state.input.length - 2).concat(val),
              str: "",
            }));
          } else if (val === "-") {
            this.setState((state) => ({
              input: state.input.concat(val),
            }));
          } else {
            this.setState((state) => ({
              input: state.input.slice(0, state.input.length - 1).concat(val),
              str: "",
            }));
          }
        } else {
          this.setState((state) => ({
            input: state.input.concat(val),
            str: state.str.concat(val),
          }));
        }
      } else {
        if ("+-x/".indexOf(val) > -1) {
          this.setState((state) => ({
            input: state.input.concat(val),
            str: "",
          }));
        } else if (val === "." && str_.indexOf(".") > -1) {
          // pass: do not accept a decimal sign if the number already has one
        } else {
          this.setState((state) => ({
            input: state.input.concat(val),
            str: state.str.concat(val),
          }));
        }
      }
    }
  }

  displayAnswer() {
    this.setState((state) => ({
      output: this.calculate(
        this.solveDoubleMinus(
          state.input.split(/(?=[+x/-])|(?<=[+x/-])/g)
        ).concat("+")
      ),
      calc: true,
    }));
  }

  render() {
    console.log(this.state);
    return (
      <div className="container my-container">
        <div className="row">
          <div className="col-12 display" id="display">
            {this.state.calc
              ? this.state.output
              : this.state.input === ""
              ? this.state.output
              : this.state.input}
          </div>
        </div>

        <div className="row">
          <Keys
            symbol="C"
            id="clear"
            classes="col-6 clear"
            clicker={this.clear}
          />
          <Keys
            symbol="x"
            id="multiply"
            classes="col-3 symbol"
            clicker={this.clickButton}
          />
          <Keys
            symbol="/"
            id="divide"
            classes="col-3 symbol"
            clicker={this.clickButton}
          />
        </div>
        <div className="row">
          <Keys
            symbol={7}
            id="seven"
            classes="col-3 number"
            clicker={this.clickButton}
          />
          <Keys
            symbol={8}
            id="eight"
            classes="col-3 number"
            clicker={this.clickButton}
          />
          <Keys
            symbol={9}
            id="nine"
            classes="col-3 number"
            clicker={this.clickButton}
          />
          <Keys
            symbol="+"
            id="add"
            classes="col-3 symbol"
            clicker={this.clickButton}
          />
        </div>
        <div className="row">
          <Keys
            symbol={4}
            id="four"
            classes="col-3 number"
            clicker={this.clickButton}
          />
          <Keys
            symbol={5}
            id="five"
            classes="col-3 number"
            clicker={this.clickButton}
          />
          <Keys
            symbol={6}
            id="six"
            classes="col-3 number"
            clicker={this.clickButton}
          />
          <Keys
            symbol="-"
            id="subtract"
            classes="col-3 symbol"
            clicker={this.clickButton}
          />
        </div>
        <div className="row">
          <div className="col-9">
            <div className="row">
              <Keys
                symbol={1}
                id="one"
                classes="col-4 number"
                clicker={this.clickButton}
              />
              <Keys
                symbol={2}
                id="two"
                classes="col-4 number"
                clicker={this.clickButton}
              />
              <Keys
                symbol={3}
                id="three"
                classes="col-4 number"
                clicker={this.clickButton}
              />
            </div>
            <div className="row">
              <Keys
                symbol={0}
                id="zero"
                classes="col-8 number"
                clicker={this.clickButton}
              />
              <Keys
                symbol="."
                id="decimal"
                classes="col-4 number"
                clicker={this.clickButton}
              />
            </div>
          </div>
          <Keys
            symbol="="
            id="equals"
            classes="col-3 tall"
            clicker={this.displayAnswer}
          />
        </div>
      </div>
    );
  }
}

export default App;
