import { Component, ViewChild } from '@angular/core';

import {
	Annotation, ChartBoxAnnotation, MeterComponent, ChartItem, ChartLabelAnnotation, ChartLabelColor,
	ChartLabelFont, ChartLabelPadding, ChartLabelPosition, ChartLabelSettings, ChartLineAnnotation, ChartMultipleYAxisScales,
	ChartTooltipItem, ChartTooltipSettings, ChartMeterConfiguration, ChartLine
} from 'systelab-meters';

@Component({
	selector:    'showcase-meter',
	templateUrl: './showcase-meter.component.html'
})
export class ShowcaseMeterComponent {

	@ViewChild('radialMeterChart') radialMeterChart: MeterComponent;
	@ViewChild('digitalMeterChart') digitalMeterChart: MeterComponent;
	@ViewChild('horizontalLinearMeterChart') horizontalLinearMeterChart: MeterComponent;
	@ViewChild('verticalLinearMeterChart') verticalLinearMeterChart: MeterComponent;
	@ViewChild('lineChart') lineChart: MeterComponent;
	@ViewChild('timelineChart') timelineChart: MeterComponent;
	@ViewChild('lineChartMultipleAxis') lineChartMultipleAxis: MeterComponent;
	@ViewChild('lineChartLegend') lineChartLegend: MeterComponent;
	@ViewChild('resizableCChart') resizableChart: MeterComponent;

	public type: string;
	public itemSelected: any;
	public legend: boolean;
	public dataLine: Array<ChartItem> = [];
	public dataTimeLine: Array<ChartItem> = [];
	public dataLineMultipleAxis: Array<ChartItem> = [];
	public dataBar: Array<ChartItem> = [];
	public radialDataChartMeterGadget: Array<ChartItem> = [];
	public verticalLinearDataChartMeterGadget: Array<ChartItem> = [];
	public horizontalLinearDataChartMeterGadget: Array<ChartItem> = [];
	public digitalDataChartMeterGadget: Array<ChartItem> = [];
	public dataRadar: Array<ChartItem> = [];
	public dataPie: Array<ChartItem> = [];
	public dataDoughnut: Array<ChartItem> = [];
	public dataBubble: Array<ChartItem> = [];
	public dataPolarArea: Array<ChartItem> = [];
	public dataLineBar: Array<ChartItem> = [];
	public dataLineBubble: Array<ChartItem> = [];
	public dataLineAnnotation: Array<ChartItem> = [];
	public dataBubbleAnnotations: Array<ChartItem> = [];
	public chartLineAnnotations: Array<ChartLineAnnotation> = [];
	public chartLineMultipleAxisAnnotations: Array<ChartLineAnnotation> = [];
	public chartMultipleAnnotations: Array<Annotation> = [];
	public chartBubbleAnnotations: Array<Annotation> = [];
	public labels: Array<string> = [];
	public labelsChartMeterGadget: Array<string> = [];
	public labelsMultipleAxis: Array<number> = [];
	public labelLineAnnotations: Array<number> = [];
	public isBackgroundGrid = false;
	public yMinValue = 0;
	public yMaxValue = 5;
	public legendOff = false;
	public xLabelAxis = 'Title X';
	public yLabelAxis = 'Title Y';
	public tooltipSettings = new ChartTooltipSettings();
	public isStacked = true;
	public dataLineCustomLegend: Array<ChartItem> = [];
	public multipleYAxisScales: Array<ChartMultipleYAxisScales> = [];
	public pieChartLabelSettings: ChartLabelSettings;
	public radialChartGadgetConfiguration: ChartMeterConfiguration;
	public verticalLinearChartGadgetConfiguration: ChartMeterConfiguration;
	public horizontalLinearChartGadgetConfiguration: ChartMeterConfiguration;
	public digitalChartGadgetConfiguration: ChartMeterConfiguration;
	public defaultResizeWidth = 1280;
	public defaultResizeHeight = 900;
	public resizedImage: string;
	public chartLine: ChartLine;

	constructor() {
		this.type = 'line';
		this.legend = true;
		this.labels = ['January', 'February', 'March', 'April'];
		this.labelsMultipleAxis = [1, 2, 3, 4];
		this.labelsChartMeterGadget = ['06/05/2020', '06/06/2020', '06/07/2020', '06/08/2020', '06/09/2020', '06/10/2020'];

		this.tooltipSettings.backgroundColor = '#ffffff';
		this.tooltipSettings.borderColor = '#0066ff';
		this.tooltipSettings.borderWidth = 3;
		this.tooltipSettings.bodyFontColor = '#6c757d';
		this.tooltipSettings.titleFontColor = '#fd7e14';

		this.generateMultipleAxisExample();
		this.radialChartGadgetConfiguration = this.generateChartGadgetConfiguration();
		this.digitalChartGadgetConfiguration = this.generateChartGadgetConfiguration();
		this.horizontalLinearChartGadgetConfiguration = this.generateChartGadgetConfiguration();
		this.verticalLinearChartGadgetConfiguration = this.generateChartGadgetConfiguration();

		this.dataLine.push(new ChartItem('Only Line', [13, 20, 21, 15.5], '', '', false, true, false, 3, '',
			new ChartTooltipItem('title', 'label', 'afterlabel', true)));

		this.dataLine.push(new ChartItem('Only Dots', [11, 18, 4, 3], '', '', false, false, false, 4));
		this.dataLine.push(new ChartItem('Line and Area', [12, 41, 1, 21], '', '', true, true, false, 3));

		this.dataTimeLine.push(new ChartItem('Label', [
			{
				t: new Date(2021, 5, 15),
				y: 3
			},
			{
				t: new Date(2022, 1, 12),
				y: 1
			}, {
				t: new Date(2022, 2, 5),
				y: 10
			},
		], '', '', false, true, false, 3, ''));
		this.dataTimeLine.push(new ChartItem('Label 2', [
			{
				t: new Date(2022, 1, 1),
				y: 2
			},
			{
				t: new Date(2022, 1, 20),
				y: 4
			}, {
				t: new Date(2022, 2, 14),
				y: 8
			}, {
				t: new Date(2022, 3, 7),
				y: 10
			},

		], '', '', false, true, false, 3, ''));


		this.dataBar.push(new ChartItem('Only Line', [12, 41, 1, 21], '', '', false, false, false, 3));
		this.dataBar.push(new ChartItem('Line and Area', [13, 20, 21, 15], '', '', true, true, false, 3));

		this.radialDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 2, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', undefined, 5));
		this.radialDataChartMeterGadget.push(new ChartItem('Value', [5, 1, 2, 1.03, 3, 10], 'green', 'lightgreen', true, true, false, 1));

		this.digitalDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 2, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', undefined, 5));
		this.digitalDataChartMeterGadget.push(new ChartItem('Value', [0, 1, 2, 1.03, 3, 11], 'green', 'lightgreen', true, true, false, 1));
		this.digitalDataChartMeterGadget.push(new ChartItem('Value 2', [0, 1, 2, 1.03, 3, 11], 'blue', 'lightblue', true, true, false, 1));

		this.verticalLinearDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 2, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', undefined, 5));
		this.verticalLinearDataChartMeterGadget.push(new ChartItem('Value', [0, 1, 2, 1.03, 3, 6.6], 'green', 'lightgreen',
			true, true, false, 1));

		this.horizontalLinearDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', undefined, 5));
		this.horizontalLinearDataChartMeterGadget.push(new ChartItem('Value', [3, 1, 12, -10], 'green', 'lightgreen', true, true, false, 1));

		this.dataRadar.push(new ChartItem('Only Line', [36, 41, 35, 21], '', '', false, true, false, 3));
		this.dataRadar.push(new ChartItem('Line and Area', [37, 40, 21, 15], '', '', true, true, false, 3));

		this.dataDoughnut.push(new ChartItem('', [36, 23, 42, 52], '', '', true, true, false, 3));

		this.pieChartLabelSettings = new ChartLabelSettings();
		this.pieChartLabelSettings.position = new ChartLabelPosition();
		this.pieChartLabelSettings.position.clip = false; // to avoid showing part of the label, set clip = true

		this.pieChartLabelSettings.position.display = (context: any): boolean => {

			const dataArr: Array<number> = (context.chart.data.datasets[0].data as Array<number>);

			const currentPercentage = context.dataset.data[context.dataIndex] * 100 / dataArr.reduce((a, b) => a + b);

			return currentPercentage >= 5;
		};
		this.pieChartLabelSettings.labelColors = new ChartLabelColor(undefined, 'black', undefined, 5, 1, 0.8);
		const fontFamily = 'Courier, Arial Unicode MS, Arial, sans-serif';
		this.pieChartLabelSettings.chartLabelFont = new ChartLabelFont(undefined, fontFamily, 16, undefined, 'bold', 0.8);
		this.pieChartLabelSettings.chartLabelPadding = new ChartLabelPadding(undefined, 1, 1, 1, 1);

		this.pieChartLabelSettings.formatter = (value: any, context: any): string => {
			const dataArr: Array<number> = (context.chart.data.datasets[0].data as Array<number>);
			return (value * 100 / dataArr.reduce((a, b) => a + b)).toFixed(0) + '%';
		};

		const pieChartItem = new ChartItem('', [36, 4, 42, 52], '', '#778899', true, true, false, 3);
		pieChartItem.labelBorderColors = this.generateColorsForSections(pieChartItem.data.length);
		pieChartItem.labelBackgroundColors = this.generateColorsForSections(pieChartItem.data.length);
		this.dataPie.push(pieChartItem);

		const polarAreaChartItem = new ChartItem('', [21, 23, 42, 52], '', '', true, true, false, 3);
		polarAreaChartItem.labelBorderColors = this.generateColorsForSections(polarAreaChartItem.data.length);
		polarAreaChartItem.labelBackgroundColors = this.generateColorsForSections(polarAreaChartItem.data.length);
		this.dataPolarArea.push(polarAreaChartItem);

		this.dataBubble.push(new ChartItem('Test 1', [{x: 13, y: 13, r: 4, t: 'Tooltip'}, {x: 1, y: 2, r: 3}, {x: 15, y: 23, r: 4},
			{x: -2, y: -2, r: 4}, {x: -10, y: 13, r: 3}, {x: 23, y: 12, r: 7}, {x: 4, y: 4, r: 8},
			{x: 3, y: 2, r: 9}], '', '', true, false, false, 2));
		this.dataBubble.push(new ChartItem('Test 2', [{x: 6, y: -2, r: 4}, {x: 2, y: 5, r: 3}, {x: 12, y: 11, r: 4}, {x: 5, y: 10, r: 4},
			{x: 10, y: 46, r: 3}, {x: 16, y: 24, r: 7}, {x: 37, y: 6, r: 8}, {x: 5, y: 3, r: 9}], '', '', true, false, false, 2));

		this.dataLineBar.push(new ChartItem('Line', [13, 20, 21, 15], '', '', false, true, true, 3, 'line'));
		this.dataLineBar.push(new ChartItem('Bar', [10, 20, 10, 15], '', '', true, true, false, 3));

		this.dataLineAnnotation.push(new ChartItem('Data Values', [2.4, 2, 1.8, 2.7, 2.5, 2.4, 2.3, 2.8, 2.3, 2.4, 2.7, 2.1, 1.9, 1.8],
			'', '', false, true, false, 3));
		this.chartLineAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation(), 2.5,
			'horizontal', 'beforeDatasetsDraw', 'line', [], '#000000', 1));
		this.chartLineAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation('-1 SD', 'left', '#e53c29'), 1.5,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#e53c29', 1));
		this.chartLineAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation('+1 SD', 'left', '#e53c29'), 3.5,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#e53c29', 1));
		this.chartLineAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation('+2 SD', 'left', '#287ae5'), 4.5,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#287ae5', 1));
		this.chartLineAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation('-2 SD', 'left', '#287ae5'), 0.5,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#287ae5', 1));
		for (let g = 1; g <= this.dataLineAnnotation[0].data.length; g++) {
			this.labelLineAnnotations.push(g);
		}

		this.chartMultipleAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation(), 4.5,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#287ae5', 1));
		this.chartMultipleAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation(), 9,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#287ae5', 1));
		this.chartMultipleAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation('Label', 'left', '#287ae5'), -1,
			'horizontal', 'beforeDatasetsDraw', 'line', [5, 15], '#287ae5', 1));
		this.chartMultipleAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation(), 6,
			'vertical', 'beforeDatasetsDraw', 'line', [], '#42f483', 1));

		/*Diagonal Annotation */
		this.chartMultipleAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation(), -5,
			'horizontal', 'beforeDatasetsDraw', 'line', [], '#000', 1, 20));
		this.chartMultipleAnnotations.push(new ChartBoxAnnotation('beforeDatasetsDraw', 2, 10, 2, 10, 'box', '', '#cccccc'));
		this.chartMultipleAnnotations.push(new ChartBoxAnnotation('beforeDatasetsDraw', 0, 12, 0, 12, 'box', '', '#5ac14b'));

		this.chartBubbleAnnotations.push(new ChartBoxAnnotation('beforeDatasetsDraw', 2, 10, 2, 10, 'box', '', '#cccccc'));
		this.chartBubbleAnnotations.push(new ChartBoxAnnotation('beforeDatasetsDraw', 0, 12, 0, 12, 'box', '', '#5ac14b'));

		this.dataBubbleAnnotations.push(new ChartItem('Test 1', [{x: 13, y: 13, r: 2}, {x: 1, y: 2, r: 2}, {x: 15, y: 23, r: 2},
			{x: -2, y: -2, r: 2}, {x: -10, y: 13, r: 2}, {x: 23, y: 12, r: 2}, {x: 4, y: 4, r: 2}, {x: 5, y: 6, r: 2},
			{x: 2, y: 3, r: 2}, {x: 1, y: 2, r: 2}, {x: 3, y: 2, r: 2}], '', '', true, false, false, 2));

		this.dataLineCustomLegend.push(new ChartItem('Line', [13, 20, 21, 15], '', '', false, true, false, 3, '',
			new ChartTooltipItem('title', 'label', 'afterlabel', true), undefined, undefined, 'line'));
		this.dataLineCustomLegend.push(new ChartItem('Dots', [11, 18, 4, 3], '', '', false, false, false,
			4, undefined, undefined, undefined, undefined, 'dots'));
		this.dataLineCustomLegend.push(new ChartItem('Line and Area', [12, 41, 1, 21], '', '', true, true,
			false, 3, undefined, undefined, undefined, undefined, 'bar'));

		this.chartLine = new ChartLine(0.5, 5, 2.5, 20, null, null);

	}

	private static randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public doAction(event: Event) {}

	public doChange() {
		this.dataLine = [];
		const rnd = ShowcaseMeterComponent.randomIntFromInterval(1, 4);
		for (let h = 1; h <= rnd; h++) {
			const dataRnd: Array<number> = [];
			for (let i = 1; i <= 4; i++) {
				dataRnd.push(ShowcaseMeterComponent.randomIntFromInterval(3, 35));
			}
			let fill = false;
			if (ShowcaseMeterComponent.randomIntFromInterval(0, 1) === 1) {
				fill = true;
			}
			this.dataLine.push(new ChartItem('Line ' + h, dataRnd, '', '', fill, true, false, 3));
		}
		this.lineChart.doUpdate();
	}

	public randomizeTimeLineChart() {
		this.dataTimeLine = [];
		const rnd = ShowcaseMeterComponent.randomIntFromInterval(1, 4);
		for (let h = 1; h <= rnd; h++) {
			const dataRnd: Array<any> = [];
			for (let i = 1; i <= 4; i++) {
				const item = {
					t: new Date(ShowcaseMeterComponent.randomIntFromInterval(2020, 2022),
						ShowcaseMeterComponent.randomIntFromInterval(1, 11),
						ShowcaseMeterComponent.randomIntFromInterval(1, 20)),
					y: ShowcaseMeterComponent.randomIntFromInterval(1, 35)
				};
				dataRnd.push(item);
			}
			let fill = false;
			if (ShowcaseMeterComponent.randomIntFromInterval(0, 1) === 1) {
				fill = true;
			}
			this.dataTimeLine.push(new ChartItem('Line ' + h, dataRnd, '', '', fill, true, false, 3));
		}
		this.timelineChart.doUpdate();
	}

	public updateMultipleAxisExample(): void {
		this.generateMultipleAxisExample();
		this.lineChartMultipleAxis.doUpdate();
	}

	public generateChartGadgetConfiguration(): ChartMeterConfiguration {
		const chartMeterConfiguration = new ChartMeterConfiguration();
		chartMeterConfiguration.numberFormat = '#.####';
		chartMeterConfiguration.betterValues = 'higher';
		chartMeterConfiguration.chartColour = 'green';
		chartMeterConfiguration.goalColour = 'blue';
		chartMeterConfiguration.defaultGoalValue = 8;
		chartMeterConfiguration.minVisualValue = -2213124102.2132321;
		chartMeterConfiguration.maxVisualValue = 123456789.2903232;
		chartMeterConfiguration.levels.push({levelColor: '#ff0000', minValue: 0, maxValue: 2});
		chartMeterConfiguration.levels.push({levelColor: '#FFFF00AA', minValue: 3, maxValue: 5});
		chartMeterConfiguration.levels.push({levelColor: '#00FF00AA', minValue: 6, maxValue: 10});
		chartMeterConfiguration.showHistory = false;
		chartMeterConfiguration.markerForGoal = 'rectRot';
		return chartMeterConfiguration;
	}

	public generateMultipleAxisExample(): void {
		this.dataLineMultipleAxis = [];

		this.multipleYAxisScales = [];
		this.multipleYAxisScales.push(this.generateChartMultipleYAxisScales('y-axis-0', 'left', 30, 105, 5));
		this.multipleYAxisScales.push(this.generateChartMultipleYAxisScales('y-axis-1', 'right', 0, 10, 2));

		this.chartLineMultipleAxisAnnotations.push(new ChartLineAnnotation(new ChartLabelAnnotation('Label', 'top'), 3,
			'vertical', 'beforeDatasetsDraw', 'line', [], '#e53c29'));

		const rndData = ShowcaseMeterComponent.randomIntFromInterval(1, 3);
		this.generateRandomData(rndData, 30, 105, 'y-axis-0', 'left');
		this.generateRandomData(rndData, 0, 10, 'y-axis-1', 'right');
	}

	public doShowHistory(meterType: string): void {
		switch (meterType) {
			case 'radialMeter':
				this.radialChartGadgetConfiguration.showHistory = !this.radialChartGadgetConfiguration.showHistory;
				this.radialMeterChart.doUpdate();
				break;
			case 'digitalMeter':
				this.digitalChartGadgetConfiguration.showHistory = !this.digitalChartGadgetConfiguration.showHistory;
				this.digitalMeterChart.doUpdate();
				break;
			case 'horizontalLinearMeter':
				this.horizontalLinearChartGadgetConfiguration.showHistory = !this.horizontalLinearChartGadgetConfiguration.showHistory;
				this.horizontalLinearMeterChart.doUpdate();
				break;
			case 'verticalLinearMeter':
				this.verticalLinearChartGadgetConfiguration.showHistory = !this.verticalLinearChartGadgetConfiguration.showHistory;
				this.verticalLinearMeterChart.doUpdate();
				break;
			default:
				break;
		}
	}

	public doResizeChart() {
		this.resizedImage = this.resizableChart.getResizedBase64Image(this.defaultResizeHeight, this.defaultResizeWidth);
	}

	public doUpdateChart() {
		this.resizableChart.chartResized = false;
		this.resizableChart.doUpdate();
		this.resizableChart.chart.resize();
	}

	public getVisualValue(chartMeterConfiguration: ChartMeterConfiguration, chartItems: Array<ChartItem>, minValue = true): number {
		let currentValue: number;

		if (minValue) {
			currentValue = Number.POSITIVE_INFINITY;
			if (chartItems) {
				chartItems.forEach(chartItem => currentValue = Math.min(currentValue, ...chartItem.data));
			}

			if (currentValue === Number.POSITIVE_INFINITY) {
				return chartMeterConfiguration.minVisualValue;
			} else if (!chartMeterConfiguration.minVisualValue) {
				return currentValue;
			} else {
				return Math.min(chartMeterConfiguration.minVisualValue, currentValue);
			}
		} else {

			const arrayOfValues: Array<number> = [Number.NEGATIVE_INFINITY];
			if (chartItems) {
				const maxLength = Math.max(...chartItems.map(item => item.data.length));
				for (let index = 0; index < maxLength; index++) {
					let value = 0;
					chartItems.forEach(item => {
						if (item.data.length > index) {
							value += item.data[index];
						}
					});
					arrayOfValues.push(value);
				}
				currentValue = Math.max(...arrayOfValues);

				if (currentValue === Number.NEGATIVE_INFINITY) {
					return chartMeterConfiguration.maxVisualValue;
				} else if (chartMeterConfiguration.maxVisualValue && chartMeterConfiguration.maxVisualValue > currentValue) {
					return chartMeterConfiguration.maxVisualValue;
				} else {
					return undefined;
				}
			}
		}
	}

	private generateRandomData(rndNumberOfElements: number, min: number, max: number, yAxisID: string, position: string) {
		for (let h = 1; h <= rndNumberOfElements; h++) {
			const dataRnd: Array<number> = [];
			for (let i = 1; i <= 4; i++) {
				dataRnd.push(ShowcaseMeterComponent.randomIntFromInterval(min, max));
			}
			let fill = false;
			if (ShowcaseMeterComponent.randomIntFromInterval(0, 1) === 1) {
				fill = true;
			}
			this.dataLineMultipleAxis.push(new ChartItem('Line ' + h + ' ' + position + ' axis', dataRnd, '', '', fill, true, false, 3,
				'line', undefined, ShowcaseMeterComponent.randomIntFromInterval(0, 3), yAxisID));
		}
	}

	private generateChartMultipleYAxisScales(id: string, position: string, min: number, max: number, stepSize: number):
		ChartMultipleYAxisScales {
		const defaultYAxisScales = new ChartMultipleYAxisScales();
		defaultYAxisScales.id = id;
		defaultYAxisScales.position = position;
		defaultYAxisScales.type = 'linear';
		defaultYAxisScales.gridLines = {display: true, drawBorder: true};
		defaultYAxisScales.scaleLabel = {display: true, labelString: this.yLabelAxis};

		defaultYAxisScales.ticks = {
			display:  true,
			min,
			max,
			stepSize,
		};

		return defaultYAxisScales;
	}

	private generateColorsForSections(length: number): Array<number[]> {
		const colorsArray: Array<number[]> = [];

		for (let i = 0; i < length; i++) {
			colorsArray.push(this.generateColorForSection(i));
		}

		return colorsArray;
	}

	private generateColorForSection(i: number): Array<number> {
		switch (i % 4) {
			case 0:
				return [255, 0, 0];
			case 1:
				return [0, 255, 0];
			case 2:
				return [0, 127, 200];
			default:
				return [255, 228, 181];
		}
	}
}
