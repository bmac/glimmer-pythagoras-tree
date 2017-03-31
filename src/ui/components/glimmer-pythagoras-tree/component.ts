import Component, { tracked } from "@glimmer/component";
import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

export default class MyApp extends Component {
    @tracked
    svg = {
        width: 1280,
        height: 600
    };

    @tracked
    currentMax = 0;

    @tracked
    baseW = 80;

    @tracked
    heightFactor = 0;

    @tracked
    lean = 0;

    running = false;

    @tracked
    realMax = 11;

    @tracked
    lvl = 0;

    @tracked('svg')
    get x() {
        return this.svg.width / 2 - 40;
    }

    @tracked('svg')
    get y() {
        return this.svg.height - this.baseW;
    }

    didInsertElement() {
        d3select(this.element).on("mousemove", this.onMouseMove.bind(this));

        this.next();
    }


    next() {
        if (this.currentMax < this.realMax) {
            this.currentMax++
            setTimeout(this.next.bind(this), 500);
        }
    }

    // Throttling approach borrowed from Vue fork
    // https://github.com/yyx990803/vue-fractal/blob/master/src/App.vue
    // rAF makes it slower than just throttling on React update
    onMouseMove(event) {
        if (this.running) return;
        this.running = true;

        const [x, y] = d3mouse(this.element);

        const scaleFactor = scaleLinear().domain([this.svg.height, 0])
            .range([0, .8]);

        const scaleLean = scaleLinear().domain([0, this.svg.width/2, this.svg.width])
            .range([.5, 0, -.5]);


        this.heightFactor = scaleFactor(y);
        this.lean = scaleLean(x);

        this.running = false;
    }
}
