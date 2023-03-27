import { AfterViewInit, ApplicationRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/dist/Chart.js';
import { RadialMeter } from '../../assets/js/meter-charts/chart.radial-meter';
import { DigitalMeter } from '../../assets/js/meter-charts/chart.digital-meter';
import { LinearMeter } from '../../assets/js/meter-charts/chart.linear-meter';
import { drawRegionsPlugin } from '../../assets/js/meter-charts/chart.common-meter-functions';
import { DecimalFormat } from '../../assets/js/decimalFormat';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { format } from 'date-fns/esm';
import 'chartjs-plugin-annotation';

export class ChartItem {

	constructor(public label: string, public data: Array<any>, public borderColor?: string, public backgroundColor?: string,
				public fill?: boolean, public showLine?: boolean, public isGradient?: boolean, public borderWidth?: number,
				public chartType?: string, public chartTooltipItem?: ChartTooltipItem | Array<ChartTooltipItem>,
				public pointRadius?: number, public yAxisID?: string, public legendType?: string,
				public labelBorderColors?: Array<number[]>, public labelBackgroundColors?: Array<number[]>) {
	}
}

export class Annotation {
	constructor(public drawTime: string, public type: string, public borderColor?: string, public borderWidth?: number,
				public scaleId = 'y-axis-0') {
	}
}

export class ChartLineAnnotation extends Annotation {
	constructor(public label: ChartLabelAnnotation, public value: number, public orientation: string, drawTime: string,
				type: string, public borderDash?: Array<number>, borderColor?: string, borderWidth?: number, public endValue?: number) {
		super(drawTime, type, borderColor, borderWidth);
	}
}

export class ChartLine {
	constructor(public xMinValue: number, public yMinValue: number, public xMaxValue: number, public yMaxValue: number,
		public borderColor?: string, public borderWidth?: number) {
	}
}

export class ChartBoxAnnotation extends Annotation {
	constructor(drawTime: string, public xMin: number, public xMax: number, public yMin: number, public yMax: number,
				type: string, public backgroundColor?: string, borderColor?: string, borderWidth?: number) {
		super(drawTime, type, borderColor, borderWidth);
	}
}

export class ChartLabelAnnotation {
	constructor(public text?: string, public position?: string, public backgroundColor?: string, public fontStyle?: string,
				public fontColor?: string) {
	}
}

export class ChartTooltipItem {
	constructor(public title?: string, public label?: string, public afterLabel?: string, public valueInAfterLabel?: boolean,
				public numberFormat?: string) {
	}
}

export class ChartTooltipSettings {
	constructor(public backgroundColor?: string, public borderColor?: string, public borderWidth?: number, public bodyFontColor?: string,
				public bodyFontSize?: number, public titleFontSize?: number, public titleFontColor?: string) {
		this.bodyFontColor = '#ffffff';
		this.borderColor = 'rgba(0,0,0,0)';
		this.borderWidth = 0;
		this.bodyFontSize = 12;
		this.titleFontSize = 12;
		this.titleFontColor = '#ffffff';
		this.backgroundColor = 'rgba(0,0,0,0.8)';
	}
}

export class ChartLabelSettings {
	constructor(public position?: ChartLabelPosition, public labelColors?: ChartLabelColor, public chartLabelFont?: ChartLabelFont,
				public chartLabelPadding?: ChartLabelPadding, public chartLabelText?: ChartLabelText,
				public formatter?: (value: any, context: any) => string) {
		this.position = new ChartLabelPosition();
		this.labelColors = new ChartLabelColor();
		this.chartLabelFont = new ChartLabelFont();
		this.chartLabelPadding = new ChartLabelPadding();
		this.chartLabelText = new ChartLabelText();
	}

}

export class ChartLabelPosition {
	constructor(public align?: string | number, public anchor?: string, public clamp?: boolean, public clip?: boolean,
				public display?: ((context: any) => (boolean | string)) | boolean | string, public offset?: number,
				public rotation?: number) {
	}
}

export class ChartLabelColor {
	constructor(public backgroundColor?: string, public color?: string, public borderColor?: string, public borderRadius?: number,
				public borderWidth?: number, public opacity?: number) {

	}
}

export class ChartLabelFont {
	constructor(public font?: object, public family?: string, public size?: number, public style?: string, public weight?: string | number,
				public lineHeight?: string | number) {

	}
}

export class ChartLabelPadding {
	constructor(public padding?: number | object, public top?: number, public right?: number, public bottom?: number,
				public left?: number) {

	}
}

export class ChartLabelText {
	constructor(public textAlign?: string, public textStrokeColor?: string, public textShadowBlur?: number,
				public textStrokeWidth?: number, public textShadowColor?: string) {

	}
}

export class ChartMultipleYAxisScales {
	constructor(public id?: string, public type?: string, public position?: string,
				public stacked = false,
				public ticks?: { min: number; max: number; stepSize?: number; display?: boolean },
				public gridLines?: { display: boolean; drawBorder: boolean },
				public scaleLabel?: { display: boolean; labelString: string }) {
	}

	public getScaleDefinition(callbackFunction?: (value, index, values) => string) {
		return {
			id:         this.id,
			type:       this.type,
			position:   this.position,
			stacked:    this.stacked,
			ticks: {
				...this.ticks,
				...callbackFunction ? {
					callback: callbackFunction
				} : {}
			},
			gridLines:  this.gridLines,
			scaleLabel: this.scaleLabel
		};
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
	@ViewChild('topLegend', {static: false}) topLegend: ElementRef;
	@ViewChild('bottomLegend', {static: false}) bottomLegend: ElementRef;

	@Input() labels: Array<any> = [];
	@Input() data: Array<ChartItem> = [];
	@Input() annotations: Array<Annotation | ChartLineAnnotation | ChartBoxAnnotation> = [];
	@Input() showLegend = true;
	@Input() legendPosition = 'top';
	@Input() isHorizontal = false;
	@Input() yMinValue: any;
	@Input() yMaxValue: any;
	@Input() xMinValue: any;
	@Input() xMaxValue: any;
	@Input() xAutoSkip = true;
	@Input() yLabelAxis: string;
	@Input() xLabelAxis: string;
	@Input() lineTension: number;
	@Input() isBackgroundGrid = true;
	@Input() type: string;
	@Input() responsive = true;
	@Input() maintainAspectRatio = true;
	@Input() tooltipSettings: ChartTooltipSettings;
	@Input() chartLabelSettings: ChartLabelSettings;
	@Input() isStacked = false;
	@Input() animationDuration = 1000;
	@Input() minValueForRadar: number;
	@Input() maxValueForRadar: number;
	@Input() multipleYAxisScales: Array<ChartMultipleYAxisScales>;
	@Input() timeScale = false;
	@Input() timeUnit = 'day';
	@Input() tooltipTimeFormat = 'd/M/yyyy';
	@Input() customLegend = false;
	@Input() chartMeterConfiguration: ChartMeterConfiguration;
	@Input() legendWithoutBox = false;
	@Input() hideInitialAndFinalTick = false;
	@Input() hideFinalTick = false;
	@Input() chartLine: ChartLine;

	@Output() itemSelectedChange = new EventEmitter();
	@Output() action = new EventEmitter();

	public chart: Chart;
	public chartResized = false;

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
	private _itemSelected: any;
	private dataset: Array<any> = [];
	private _annotations: Array<any> = [];
	private axesVisible = true;
	private yAxisLabelVisible = false;
	private xAxisLabelVisible = false;

	constructor(private readonly appRef: ApplicationRef) {
		Chart.defaults.radialMeter = Chart.defaults.bar;
		Chart.defaults.digitalMeter = Chart.defaults.bar;
		Chart.defaults.linearMeter = Chart.defaults.bar;
		Chart.controllers.radialMeter = RadialMeter;
		Chart.controllers.digitalMeter = DigitalMeter;
		Chart.controllers.linearMeter = LinearMeter;
		Chart.pluginService.register(drawRegionsPlugin);
	}

	@Input()
	get itemSelected(): any {
		return this._itemSelected;
	}
	set itemSelected(value: any) {
		this._itemSelected = value;
		this.itemSelectedChange.emit(this._itemSelected);
	}

	public ngAfterViewInit(): void {
		Chart.plugins.unregister(ChartDataLabels);
		let cx: CanvasRenderingContext2D;

		if (this.type === 'bar') {
			if (this.isHorizontal) {
				this.type = 'horizontalBar';
			}
		}

		if (!this.tooltipSettings) {
			this.tooltipSettings = new ChartTooltipSettings();
		}

		if (this.canvas.nativeElement) {
			cx = this.canvas.nativeElement.getContext('2d');
		}

		if (this.customLegend) {
			this.initCustomLegend();
		}

		this.setData(cx);

		this.setAxisVisibility();

		this.addAnnotations();
		this.drawChart(cx);
		if (this.customLegend && this.data.filter(obj => obj.legendType != null).length === this.data.length) {
			this.buildCustomLegend();
		}
	}

	public rgba(colour: Array<number>, alpha: number): string {
		return 'rgba(' + colour.concat(alpha)
			.join(',') + ')';
	}

	public getResizedBase64Image(height?: number, width?: number): string {
		let base64ImageString: string;
		if (this.chart) {
			if (width || height) {

				const canvasOffsetHeight = this.chart.canvas.parentElement.offsetHeight;
				const canvasOffsetWidth = this.chart.canvas.parentElement.offsetWidth;
				const originalAspectRatio = this.maintainAspectRatio;
				const originalResponsive = this.responsive;
				this.responsive = false;
				this.maintainAspectRatio = false;
				this.chart.resize();
				if (this.doResizeChart(height, width)) {
					this.appRef.tick();

					this.chart.resize();
					base64ImageString = this.chart.toBase64Image();
					this.maintainAspectRatio = originalAspectRatio;
					this.responsive = originalResponsive;
					this.chartResized = false;
					this.doResizeChart(canvasOffsetHeight, canvasOffsetWidth);
					this.doUpdate();

				}
			} else {
				base64ImageString = this.chart.toBase64Image();
			}
			return base64ImageString;
		}
		return undefined;
	}

	public doResizeChart(height: number, width: number): boolean {
		const elementToResize = this.chart.canvas.parentElement;
		let doResize = false;
		if (height) {
			doResize = true;
			elementToResize.style.height = height + 'px';
		}
		if (width) {
			doResize = true;
			elementToResize.style.width = width + 'px';
		}
		this.chartResized = doResize;
		return doResize;
	}

	public doUpdate(): void {
		let cx: CanvasRenderingContext2D;
		if (this.canvas.nativeElement) {
			cx = this.canvas.nativeElement.getContext('2d');
		}
		this.chart.destroy();

		this.setAxisVisibility();

		this.dataset = [];
		this._annotations = [];
		this.setData(cx);
		this.addAnnotations();
		this.drawChart(cx);
		if (this.customLegend && this.data.filter(obj => obj.legendType != null).length === this.data.length) {
			this.buildCustomLegend();
		}
	}

	public drawLine(chartData, chartLine: ChartLine) {
		const scales = (chartData.chart as any).scales;

		let cx: CanvasRenderingContext2D;
		if (this.canvas.nativeElement) {
			cx = this.canvas.nativeElement.getContext('2d');
		}

		let xScale: any;
		let yScale: any;
		Object.keys(scales)
			.forEach(
				k => (k[0] === 'x' && (xScale = scales[k])) || (yScale = scales[k])
			);

		const getXY = (x: number, y: number) => ({
			x: xScale.getPixelForValue(x, undefined, undefined, true),
			y: yScale.getPixelForValue(y)
		});

		const initPoint = getXY(chartLine.xMinValue, chartLine.yMinValue);
		const endPoint = getXY(chartLine.xMaxValue, chartLine.yMaxValue);

		cx.beginPath();
		cx.lineWidth = chartLine.borderWidth || 1;
		cx.moveTo(initPoint.x, initPoint.y);
		cx.lineTo(endPoint.x, endPoint.y);
		cx.strokeStyle = chartLine.borderColor || 'black';
		cx.stroke();
		cx.closePath();
		cx.restore();
	}

	private initCustomLegend() {
		this.showLegend = false;
	}

	private buildCustomLegend() {
		let legendItems = [];
		if (this.legendPosition === 'top') {
			this.topLegend.nativeElement.innerHTML = this.chart.generateLegend();
			legendItems = this.topLegend.nativeElement.getElementsByTagName('li');
		} else {
			this.bottomLegend.nativeElement.innerHTML = this.chart.generateLegend();
			legendItems = this.bottomLegend.nativeElement.getElementsByTagName('li');
		}
		for (let i = 0; i < legendItems.length; i += 1) {
			legendItems[i].addEventListener('click', this.legendClickCallback.bind(this), false);
		}
	}

	private drawChart(cx: CanvasRenderingContext2D) {
		const tooltipTimeFormatConstant = this.tooltipTimeFormat;
		/* Draw the chart */
		if (this.canvas.nativeElement) {
			const definition: any = {
				type: this.type,
				data: {
					labels:   this.labels,
					datasets: this.dataset
				},

				options: {
					animation: {
						duration: this.animationDuration,
						onComplete: (chartData) => {
							if (this.chartLine) {
								this.drawLine(chartData, this.chartLine);
							}
						}
					},
					responsive:          this.responsive,
					maintainAspectRatio: this.maintainAspectRatio,
					onClick:             (evt, item) => {
						const e = item[0];
						if (e) {
							this.itemSelected = e;
							this.action.emit();
						}
					},
					elements:            {
						line: {
							tension: this.lineTension
						}
					},
					display:             true,
					legend:              {
						display:  this.showLegend,
						position: this.legendPosition,
						...this.legendWithoutBox ? {
							labels: {
								boxWidth: 0
						}} : {}
					},
					legendCallback: (chart) => {
						const text = [];
						text.push('<ul class="' + chart.id + '-legend">');
						const data = chart.data;
						const dataSets = data.datasets;
						if (dataSets.length) {
							for (let i = 0; i < dataSets.length; i++) {
								text.push('<li>');
								if (dataSets[i].legendType) {
									if (dataSets[i].borderColor && dataSets[i].backgroundColor) {
										if (dataSets[i].backgroundColor === 'transparent') {
											text.push('<span class="' + dataSets[i].legendType + '" style="background-color:' + dataSets[i].borderColor + '; ' +
												'border-color:' + dataSets[i].borderColor + '"></span>');
										} else if (dataSets[i].borderColor === 'transparent') {
											text.push('<span class="' + dataSets[i].legendType + '" style="background-color:' + dataSets[i].backgroundColor + '; ' +
												'border-color:' + dataSets[i].backgroundColor + '"></span>');
										} else {
											text.push('<span class="' + dataSets[i].legendType + '" style="background-color:' + dataSets[i].backgroundColor + ';' +
												' border-color:' + dataSets[i].borderColor + '"></span>');
										}
									} else if (dataSets[i].borderColor) {
										text.push('<span class="' + dataSets[i].legendType + '" style="border-color:' + dataSets[i].borderColor + '"></span>');
									} else if (dataSets[i].backgroundColor) {
										text.push('<span class="' + dataSets[i].legendType + '" style="background-color:' + dataSets[i].backgroundColor + '"></span>');
									}
								}
								text.push(dataSets[i].label);
								text.push('</li>');
							}
						}
						text.push('</ul>');
						return text.join('');
					},
					scales:              {
						adapters: {
							date: 'date-fns',
						} ,
						yAxes: this.multipleYAxisScales ? this.multipleYAxisScales.map(yAxis => yAxis.getScaleDefinition(
							this.hideInitialAndFinalTick ? this.removeInitialAndFinalTick : this.hideFinalTick ? this.removeFinalTick : null)) : [
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
									display:    this.isBackgroundGrid,
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
								display:    this.isBackgroundGrid,
								drawBorder: this.axesVisible
							},
							scaleLabel: {
								display:     this.xAxisLabelVisible,
								labelString: this.xLabelAxis
							}
						}]
					},
					annotation:          {
						events:      ['click'],
						annotations: this._annotations
					},
					tooltips:            {
						position:        this.type === 'bar' ? 'nearest' : 'average',
						callbacks:       {
							title: (tooltipItem, data) => {
								const item = data.datasets[tooltipItem[0].datasetIndex];

								if (item.chartTooltipItem) {
									const chartTooltipItem = item.chartTooltipItem instanceof Array ? item.chartTooltipItem[tooltipItem[0].index] : item.chartTooltipItem;
									if (chartTooltipItem.title) {
										return chartTooltipItem.title;
									}
								}
							},
							label: (tooltipItem, data) => {
								const item = data.datasets[tooltipItem.datasetIndex];
								let label = data.datasets[tooltipItem.datasetIndex].label;
								if (!label) {
									label = data.labels[tooltipItem.index];
								}
								const val = item.data[tooltipItem.index];
								let rt = '';
								let rtVal: number;
								if (val instanceof Object) {
									if (val.t) {
										if(val.t instanceof Date){
											const dataValue = '(' + (val.x ? val.x + ',' : '') + val.y + ')';
											rt = format(val.t , tooltipTimeFormatConstant) + dataValue;
										} else {
											rt = val.t;
										}

									} else {
										rt = '(' + val.x + ',' + val.y + ')';
									}
								} else {
									rt = val;
									rtVal = val;
								}
								if (item.chartTooltipItem) {
									const chartTooltipItem = item.chartTooltipItem instanceof Array
										? item.chartTooltipItem[tooltipItem.index] : item.chartTooltipItem;

									if (!isNaN(rtVal) && chartTooltipItem.numberFormat) {
										rt = new DecimalFormat(chartTooltipItem.numberFormat).format(val);
									}

									if (chartTooltipItem.label) {
										label = chartTooltipItem.label;
									}
									if (!chartTooltipItem.valueInAfterLabel) {
										label += ': ' + rt;
									}
								} else {
									label += ': ' + rt;
								}
								return label;
							},
							afterLabel: (tooltipItem, data) => {
								const item = data.datasets[tooltipItem.datasetIndex];
								let afterLabel = '';

								if (item.chartTooltipItem) {
									const chartTooltipItem = item.chartTooltipItem instanceof Array ?
										item.chartTooltipItem[tooltipItem.index] : item.chartTooltipItem;
									if (chartTooltipItem.afterLabel) {
										afterLabel = chartTooltipItem.afterLabel;
									}
									if (chartTooltipItem.valueInAfterLabel) {
										const val = data[tooltipItem.index];
										let rt = '';
										if (val instanceof Object) {
											if (val.t) {
												rt = val.t;
											} else {
												rt = '(' + val.x + ',' + val.y + ')';
											}
										} else {
											if (!isNaN(val) && chartTooltipItem.numberFormat) {
												rt = new DecimalFormat(chartTooltipItem.numberFormat).format(val);
											} else {
												rt = val;
											}
										}
										afterLabel += ' (' + rt + ')';
									}
								}
								return afterLabel;
							}
						},
						backgroundColor: this.tooltipSettings.backgroundColor,
						titleFontSize:   this.tooltipSettings.titleFontSize,
						titleFontColor:  this.tooltipSettings.titleFontColor,
						bodyFontColor:   this.tooltipSettings.bodyFontColor,
						bodyFontSize:    this.tooltipSettings.bodyFontSize,
						borderColor:     this.tooltipSettings.borderColor,
						borderWidth:     this.tooltipSettings.borderWidth
					}
				}
			};

			if (this.type === 'radar') {
				definition.options.scale = {
					ticks: {
						min: this.minValueForRadar,
						max: this.maxValueForRadar
					}
				};
			}
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

			if (this.chartLabelSettings) {
				definition.plugins = [ChartDataLabels];
				definition.options.plugins = {
					datalabels: {
						align:           this.chartLabelSettings.position.align,
						anchor:          this.chartLabelSettings.position.anchor,
						backgroundColor: this.chartLabelSettings.labelColors.backgroundColor,
						borderColor:     this.chartLabelSettings.labelColors.borderColor,
						borderRadius:    this.chartLabelSettings.labelColors.borderRadius,
						borderWidth:     this.chartLabelSettings.labelColors.borderWidth,
						clamp:           this.chartLabelSettings.position.clamp,
						clip:            this.chartLabelSettings.position.clip,
						color:           this.chartLabelSettings.labelColors.color,
						display:         this.chartLabelSettings.position.display,
						font:            this.initDatalabelsFontProperties(this.chartLabelSettings.chartLabelFont),
						formatter:       this.chartLabelSettings.formatter,
						offset:          this.chartLabelSettings.position.offset,
						opacity:         this.chartLabelSettings.labelColors.opacity,
						padding:         this.initDatalabelsPaddingProperties(this.chartLabelSettings.chartLabelPadding),
						rotation:        this.chartLabelSettings.position.rotation,
						textAlign:       this.chartLabelSettings.chartLabelText.textAlign,
						textStrokeColor: this.chartLabelSettings.chartLabelText.textStrokeColor,
						textStrokeWidth: this.chartLabelSettings.chartLabelText.textStrokeWidth,
						textShadowBlur:  this.chartLabelSettings.chartLabelText.textShadowBlur,
						textShadowColor: this.chartLabelSettings.chartLabelText.textShadowColor
					}
				};
			} else {
				definition.options.plugins = {
					datalabels: {
							display: false
						}
					};
			}
			this.chart = new Chart(cx, definition);
		}
	}

	private removeInitialAndFinalTick(value, index, values): string {
		return index === 0 || index === values.length - 1 ? '' : value;
	}

	private removeFinalTick(value, index, values): string {
		return index === 0 ? '' : value;
	}

	private initDatalabelsFontProperties(chartLabelText: ChartLabelFont): object {
		let font: any;

		if (chartLabelText.font) {
			font = chartLabelText.font;
		} else {
			font = {};
		}

		if (chartLabelText.family) {
			font.family = chartLabelText.family;
		}

		if (chartLabelText.size) {
			font.size = chartLabelText.size;
		}

		if (chartLabelText.style) {
			font.style = chartLabelText.style;
		}

		if (chartLabelText.weight) {
			font.weight = chartLabelText.weight;
		}

		if (chartLabelText.lineHeight) {
			font.lineHeight = chartLabelText.lineHeight;
		}

		return font;
	}

	private initDatalabelsPaddingProperties(chartLabelPadding: ChartLabelPadding): object {

		let padding: any;

		if (chartLabelPadding.padding) {
			padding = chartLabelPadding.padding;
		} else {
			padding = {};
		}

		if (chartLabelPadding.top) {
			padding.top = chartLabelPadding.top;
		}

		if (chartLabelPadding.right) {
			padding.right = chartLabelPadding.right;
		}

		if (chartLabelPadding.bottom) {
			padding.bottom = chartLabelPadding.bottom;
		}

		if (chartLabelPadding.left) {
			padding.left = chartLabelPadding.left;
		}

		return padding;
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
				} else if ((this.type === 'pie' || this.type === 'doughnut' || this.type === 'polarArea') && !this.data[i].chartType) {
					const backgroundColorList: Array<any> = [];
					const borderColorList: Array<any> = [];
					for (let j = 0; j < this.data[i].data.length; j++) {
						if (this.data[i].labelBorderColors && this.data[i].labelBorderColors[j]) {
							borderColorList.push(this.rgba(this.data[i].labelBorderColors[j], 1));
						} else {
							borderColorList.push(this.rgba(this.defaultColors[colorNumber], 1));
						}
						if (this.data[i].labelBackgroundColors && this.data[i].labelBackgroundColors[j]) {
							backgroundColorList.push(this.rgba(this.data[i].labelBackgroundColors[j], 1));
						} else {
							backgroundColorList.push(this.rgba(this.defaultColors[colorNumber], 1));
						}

						colorNumber++;
						if (colorNumber > (this.defaultColors.length - 1)) {
							colorNumber = 0;
						}
					}
					borderColors = borderColorList;
					backgroundColors = backgroundColorList;
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
					pointRadius:      this.data[i].pointRadius,
					chartTooltipItem: this.data[i].chartTooltipItem,
					legendType:       this.data[i].legendType
				});
			}
		}

	}

	private addAnnotations() {
		if (this.annotations) {
			for (let i = 0; i < this.annotations.length; i++) {
				if (this.annotations[i] instanceof ChartLineAnnotation) {
					this.addLineAnnotation(<ChartLineAnnotation>this.annotations[i], this.rgba(this.defaultColors[this.getColorNumber(i)], 1),
						this.rgba(this.defaultColors[this.getColorNumber(i) + 1], 1));
				}
				if (this.annotations[i] instanceof ChartBoxAnnotation) {
					this.addBoxAnnotation(<ChartBoxAnnotation>this.annotations[i], this.rgba(this.defaultColors[this.getColorNumber(i)], 1));

				}
			}
		}
	}

	private addLineAnnotation(lineAnnotation: ChartLineAnnotation, defaultBorderColor: any, defaultBackgroundColor: any) {

		if (!lineAnnotation.borderColor) {
			lineAnnotation.borderColor = defaultBorderColor;
		}
		if (!lineAnnotation.borderWidth) {
			lineAnnotation.borderWidth = 2;
		}

		if (lineAnnotation.label) {
			if (!lineAnnotation.label.backgroundColor) {
				lineAnnotation.label.backgroundColor = defaultBackgroundColor;
			}
			if (!lineAnnotation.label.position) {
				lineAnnotation.label.position = 'center';
			}
			if (!lineAnnotation.label.fontColor) {
				lineAnnotation.label.fontColor = '#ffffff';
			}
			if (!lineAnnotation.label.fontStyle) {
				lineAnnotation.label.fontStyle = 'normal';
			}
		}
		let scaleId = lineAnnotation.scaleId;
		if (lineAnnotation.orientation === 'vertical') {
			scaleId = 'x-axis-0';
		}
		this._annotations.push({
			drawTime:    lineAnnotation.drawTime, id: 'annotation' + (this._annotations.length + 1),
			type:        lineAnnotation.type,
			mode:        lineAnnotation.orientation,
			scaleID:     scaleId,
			value:       lineAnnotation.value,
			borderColor: lineAnnotation.borderColor,
			endValue:    lineAnnotation.endValue,
			borderWidth: lineAnnotation.borderWidth,
			borderDash:  lineAnnotation.borderDash,
			label:       {
				backgroundColor: lineAnnotation.label.backgroundColor,
				position:        lineAnnotation.label.position,
				content:         lineAnnotation.label.text,
				fontColor:       lineAnnotation.label.fontColor,
				enabled:         true,
				fontStyle:       lineAnnotation.label.fontStyle
			}
		});
	}

	private getColorNumber(i: number): number {
		let colorNumber = i;
		if (colorNumber > (this.defaultColors.length - 1)) {
			colorNumber = 0;
		}
		return colorNumber;
	}

	private addBoxAnnotation(boxAnnotation: ChartBoxAnnotation, defaultBorderColor: any) {

		if (!boxAnnotation.borderColor) {
			boxAnnotation.borderColor = defaultBorderColor;
		}

		if (!boxAnnotation.borderWidth) {
			boxAnnotation.borderWidth = 2;
		}

		if (!boxAnnotation.backgroundColor) {
			boxAnnotation.backgroundColor = 'transparent';
		}

		this._annotations.push({
			drawTime:        boxAnnotation.drawTime,
			id:              'annotation' + (this._annotations.length + 1),
			type:            boxAnnotation.type,
			backgroundColor: boxAnnotation.backgroundColor,
			borderWidth:     boxAnnotation.borderWidth,
			borderColor:     boxAnnotation.borderColor,
			xMin:            boxAnnotation.xMin,
			xMax:            boxAnnotation.xMax,
			yMin:            boxAnnotation.yMin,
			yMax:            boxAnnotation.yMax,
			xScaleID:        'x-axis-0',
			yScaleID:        boxAnnotation.scaleId
		});

	}

	private setAxisVisibility(): void {
		/* Axes Labels */
		this.axesVisible = !(this.type === 'pie' || this.type === 'doughnut' || this.type === 'polarArea' || this.type === 'radar');
		this.xAxisLabelVisible = !!this.xLabelAxis;
		this.yAxisLabelVisible = !!this.yLabelAxis;
	}

	private legendClickCallback(event) {
		event = event || window.event;
		let target = event.target || event.srcElement;
		while (target.nodeName !== 'LI') {
			target = target.parentElement;
		}
		const parent = target.parentElement;
		const chart: any = this.chart;
		const index = Array.prototype.slice.call(parent.children)
			.indexOf(target);

		this.chart.data.datasets[index].hidden = !this.chart.data.datasets[index].hidden;
		if (chart) {
			if (chart.isDatasetVisible(index)) {
				target.classList.remove('hidden');
			} else {
				target.classList.add('hidden');
			}
			chart.update();
		}
	}
}
