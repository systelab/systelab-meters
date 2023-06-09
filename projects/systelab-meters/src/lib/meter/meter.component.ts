import { AfterViewInit, ApplicationRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/dist/Chart.js';
import { RadialMeter } from '../../assets/js/meter-charts/chart.radial-meter';
import { DigitalMeter } from '../../assets/js/meter-charts/chart.digital-meter';
import { LinearMeter } from '../../assets/js/meter-charts/chart.linear-meter';

export class ChartItem {

	constructor(public label: string, public data: Array<any>, public borderColor?: string, public backgroundColor?: string,
				public fill?: boolean, public showLine?: boolean, public isGradient?: boolean, public borderWidth?: number,
				public chartType?: string,
				public pointRadius?: number, public yAxisID?: string) {
	}
}

export class ChartMeterConfiguration {
	public borderColor = '#007bff';
	public numberFormat: string;
	public chartColour: string;
	public goalColour: string;
	public betterValues: string | 'higher' | 'lower';
	public markerForGoal: string | 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded'
		| 'rectRot' | 'star' | 'triangle' = 'circle';
	public defaultGoalValue: number;
	public minVisualValue: number;
	public maxVisualValue: number;
	public showHistory = false;
	public levels: Array<{ levelColor: string; minValue: number; maxValue: number }> = [];

	constructor() {
	}
}

@Component({
	selector:    'systelab-meter',
	templateUrl: './meter.component.html'
})
export class MeterComponent implements AfterViewInit {
	@ViewChild('canvas', {static: true}) canvas: ElementRef;

	@Input() data: Array<ChartItem> = [];
	@Input() isHorizontal = false;
	@Input() yMinValue: any;
	@Input() yMaxValue: any;
	@Input() xMinValue: any;
	@Input() xMaxValue: any;
	@Input() xAutoSkip = true;
	@Input() yLabelAxis: string;
	@Input() xLabelAxis: string;
	@Input() type: string;
	@Input() responsive = true;
	@Input() maintainAspectRatio = true;
	@Input() isStacked = false;
	@Input() timeScale = false;
	@Input() timeUnit = 'day';
	@Input() chartMeterConfiguration: ChartMeterConfiguration;
	@Input() hideInitialAndFinalTick = false;
	@Input() hideFinalTick = false;

	public chart: Chart;

	private defaultColors: Array<number[]> = [
		[255, 99, 132],
		[54, 162, 235],
		[255, 206, 86],
		[75, 192, 192],
		[220, 220, 220],
		[247, 70, 74],
		[70, 191, 189],
		[253, 180, 92],
		[148, 159, 177],
		[151, 187, 205],
		[231, 233, 237],
		[77, 83, 96]];
	private dataset: Array<any> = [];
	private axesVisible = true;
	private yAxisLabelVisible = false;
	private xAxisLabelVisible = false;

	constructor(private readonly appRef: ApplicationRef) {
		Chart.controllers.radialMeter = RadialMeter;
		Chart.controllers.digitalMeter = DigitalMeter;
		Chart.controllers.linearMeter = LinearMeter;
	}

	public ngAfterViewInit(): void {
		let cx: CanvasRenderingContext2D;
		if (this.canvas.nativeElement) {
			cx = this.canvas.nativeElement.getContext('2d');
		}
		this.setData(cx);
		this.drawChart(cx);
	}

	public rgba(colour: Array<number>, alpha: number): string {
		return 'rgba(' + colour.concat(alpha).join(',') + ')';
	}

	private drawChart(cx: CanvasRenderingContext2D) {
		/* Draw the chart */
		if (this.canvas.nativeElement) {
			const definition: any = {
				type: this.type,
				data: {
					datasets: this.dataset
				},

				options: {
					responsive:          this.responsive,
					maintainAspectRatio: this.maintainAspectRatio,
					display:             true,
					legend:              {
						display:  false
					},
					scales:              {
						adapters: {
							date: 'date-fns',
						} ,
						yAxes: [
							{
								stacked:    this.isStacked,
								ticks:      {
									min:     this.yMinValue,
									max:     this.yMaxValue,
									display: this.axesVisible,
									...this.hideInitialAndFinalTick ? {
										callback: this.removeInitialAndFinalTick
									} : {},
									...this.hideFinalTick ? {
										callback: this.removeFinalTick
									} : {}
								},
								gridLines:  {
									drawBorder: this.axesVisible
								},
								scaleLabel: {
									display:     this.yAxisLabelVisible,
									labelString: this.yLabelAxis
								}
							}],
						xAxes: [{
							...this.timeScale ? {
								type: 'time',
								time: {
									unit: this.timeUnit,
									minUnit: 'minute'
								}
							} : {},
							stacked:    this.isStacked,
							ticks:      {
								min:      this.xMinValue,
								max:      this.xMaxValue,
								display:  this.axesVisible,
								autoSkip: this.xAutoSkip,
								...this.hideInitialAndFinalTick ? {
									callback: this.removeInitialAndFinalTick
								} : {},
								...this.hideFinalTick ? {
									callback: this.removeFinalTick
								} : {}
							},
							gridLines:  {
								drawBorder: this.axesVisible
							},
							scaleLabel: {
								display:     this.xAxisLabelVisible,
								labelString: this.xLabelAxis
							}
						}]
					}
				}
			};

			if (this.type.endsWith('Meter')) {
				definition.options.chartMeterOptions = this.chartMeterConfiguration;
				definition.data.datasets[0].pointStyle = this.chartMeterConfiguration.markerForGoal;
				definition.data.datasets.forEach((dataSet) => {
					dataSet.categoryPercentage = 0.8;
					dataSet.barPercentage = 0.9;
				});
				definition.options.scales.xAxes[0].offset = true;
				definition.options.isHorizontal = this.isHorizontal;
			}


				definition.options.plugins = {
					datalabels: {
							display: false
						}
					};

			this.chart = new Chart(cx, definition);
		}
	}

	private removeInitialAndFinalTick(value, index, values): string {
		return index === 0 || index === values.length - 1 ? '' : value;
	}

	private removeFinalTick(value, index, values): string {
		return index === 0 ? '' : value;
	}

	private setData(cx: CanvasRenderingContext2D) {

		let borderColors: any;
		let backgroundColors: any;

		if (this.data) {
			let colorNumber = 0;

			for (let i = 0; i < this.data.length; i++) {
				colorNumber = i;
				if (this.data[i].isGradient) {
					const gradientStroke = cx.createLinearGradient(500, 0, 100, 0);
					gradientStroke.addColorStop(0, this.rgba(this.defaultColors[0], 1));
					gradientStroke.addColorStop(1, this.rgba(this.defaultColors[1], 1));
					borderColors = gradientStroke;
					backgroundColors = gradientStroke;
				} else {
					if (colorNumber > (this.defaultColors.length - 1)) {
						colorNumber = 0;
					}
					if (!this.data[i].borderColor) {
						this.data[i].borderColor = this.rgba(this.defaultColors[colorNumber], 1);
					}
					if (!this.data[i].backgroundColor) {
						if (this.data[i].fill) {
							this.data[i].backgroundColor = this.rgba(this.defaultColors[colorNumber], 0.6);
						} else {
							this.data[i].backgroundColor = 'transparent';
						}
					}
					borderColors = this.data[i].borderColor;
					backgroundColors = this.data[i].backgroundColor;
				}
				this.dataset.push({
					yAxisID:          this.data[i].yAxisID,
					label:            this.data[i].label,
					data:             this.data[i].data,
					borderColor:      borderColors,
					backgroundColor:  backgroundColors,
					fill:             this.data[i].fill,
					type:             this.data[i].chartType,
					borderWidth:      this.data[i].borderWidth,
					showLine:         this.data[i].showLine,
					pointRadius:      this.data[i].pointRadius
				});
			}
		}
	}
}
