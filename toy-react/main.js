import { ToyReact, Component } from './ToyReact'

// class MyComponent extends Component {
//   render() {
//     return <div>
//       <span>hello</span>
//       <span>world!</span>
//       <div>
//         {true}
//         {this.children}
//       </div>
//     </div>
//   }
// }

// const a =
//   <MyComponent name="a" id="box">
//     <div>123</div>
//   </MyComponent>

class Square extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null
    }
  }
  render() {
    console.log(this.state.value)
    return (
      <button className='square' onClick={() => {
        this.setState({ value: 'X' })
      }}>
        {this.state.value || ''}
      </button>
    )
  }
}
class Board extends Component {
  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

ToyReact.render(<Board />, document.body)
