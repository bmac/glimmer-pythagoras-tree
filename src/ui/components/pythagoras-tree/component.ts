import Component, { tracked } from "@glimmer/component";
import { interpolateViridis } from 'd3-scale';

Math.deg = function(radians) {
    return radians * (180 / Math.PI);
};

const memoizedCalc = function () {
    const memo = {};

    const key = ({ w, heightFactor, lean }) => [w,heightFactor, lean].join('-');

    return (args) => {
        const memoKey = key(args);

        if (memo[memoKey]) {
            return memo[memoKey];
        }else{
            const { w, heightFactor, lean } = args;

            const trigH = heightFactor*w;

            const result = {
                nextRight: Math.sqrt(trigH**2 + (w * (.5+lean))**2),
                nextLeft: Math.sqrt(trigH**2 + (w * (.5-lean))**2),
                A: Math.deg(Math.atan(trigH / ((.5-lean) * w))),
                B: Math.deg(Math.atan(trigH / ((.5+lean) * w)))
            };

            memo[memoKey] = result;
            return result;
        }
    }
}();

export default class PythagorasTree extends Component {
    @tracked('args')
    get show() {
        return !(this.args.lvl+1 >= this.args.maxlvl || this.args.w < 1)
    }

    @tracked('args')
    get calc() {
        return memoizedCalc({
            w: this.args.w,
            heightFactor: this.args.heightFactor,
            lean: this.args.lean
        });
    }

    @tracked('args')
    get rotate() {
        if (this.args.left) {
            return `rotate(${-this.calc.A} 0 ${this.args.w})`;
        } else if (this.args.right) {
            return `rotate(${this.calc.B} ${this.args.w} ${this.args.w})`;
        }
    }

    @tracked('calc')
    get y() {
        return - this.calc.nextRight;
    }

    @tracked('calc')
    get x() {
        return this.args.w - this.calc.nextRight;
    }

    subtract(a, b) {
        return a - b;
    }

    @tracked('args')
    get nextLvl() {
        return this.args.lvl + 1
    }

    @tracked('args')
    get fill() {
        return interpolateViridis(this.args.lvl / this.args.maxlvl)
    }

    interpolateViridis(lvl, maxlvl) {
        return interpolateViridis(lvl / maxlvl);
    }
}

// const Pythagoras = ({ w,x, y, heightFactor, lean, left, right, lvl, maxlvl }) => {
//     if (lvl >= maxlvl || w < 1) {
//         return null;
//     }

//     const { nextRight, nextLeft, A, B } = memoizedCalc({
//         w: w,
//         heightFactor: heightFactor,
//         lean: lean
//     });

//     let rotate = '';

//     if (left) {
//         rotate = `rotate(${-A} 0 ${w})`;
//     }else if (right) {
//         rotate = `rotate(${B} ${w} ${w})`;
//     }

//     return (
//             <g transform={`translate(${x} ${y}) ${rotate}`}>
//             <rect width={w} height={w}
//         x={0} y={0}
//         style={{fill: interpolateViridis(lvl/maxlvl)}} />

//             <Pythagoras w={nextLeft}
//         x={0} y={-nextLeft}
//         lvl={lvl+1} maxlvl={maxlvl}
//         heightFactor={heightFactor}
//         lean={lean}
//         left />

//             <Pythagoras w={nextRight}
//         x={w-nextRight} y={-nextRight}
//         lvl={lvl+1} maxlvl={maxlvl}
//         heightFactor={heightFactor}
//         lean={lean}
//         right />

//         </g>
//     );
// };

// export default Pythagoras;
