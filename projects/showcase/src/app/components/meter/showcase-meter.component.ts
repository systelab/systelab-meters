import { Component, ViewChild } from '@angular/core';

import {
	MeterComponent, ChartItem,
	ChartMeterConfiguration
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

	public radialDataChartMeterGadget: Array<ChartItem> = [];
	public verticalLinearDataChartMeterGadget: Array<ChartItem> = [];
	public horizontalLinearDataChartMeterGadget: Array<ChartItem> = [];
	public digitalDataChartMeterGadget: Array<ChartItem> = [];

	public isStacked = true;
	public radialChartGadgetConfiguration: ChartMeterConfiguration;
	public verticalLinearChartGadgetConfiguration: ChartMeterConfiguration;
	public horizontalLinearChartGadgetConfiguration: ChartMeterConfiguration;
	public digitalChartGadgetConfiguration: ChartMeterConfiguration;

	constructor() {

		this.radialChartGadgetConfiguration = this.generateChartGadgetConfiguration();
		this.digitalChartGadgetConfiguration = this.generateChartGadgetConfiguration();
		this.horizontalLinearChartGadgetConfiguration = this.generateChartGadgetConfiguration();
		this.verticalLinearChartGadgetConfiguration = this.generateChartGadgetConfiguration();

		this.radialDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 2, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', 5));
		this.radialDataChartMeterGadget.push(new ChartItem('Value', [5, 1, 2, 1.03, 3, 10], 'green', 'lightgreen', true, true, false, 1));



		this.digitalDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 2, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', 5));
		this.digitalDataChartMeterGadget.push(new ChartItem('Value', [0, 1, 2, 1.03, 3, 11], 'green', 'lightgreen', true, true, false, 1));
		this.digitalDataChartMeterGadget.push(new ChartItem('Value 2', [0, 1, 2, 1.03, 3, 11], 'blue', 'lightblue', true, true, false, 1));

		this.verticalLinearDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 2, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', 5));
		this.verticalLinearDataChartMeterGadget.push(new ChartItem('Value', [0, 1, 2, 1.03, 3, 6.6], 'green', 'lightgreen',
			true, true, false, 1));

		this.horizontalLinearDataChartMeterGadget.push(new ChartItem('Goal', [8, 8, 8, 8], 'blue', 'blue', false, true, false,
			3, 'line', 5));
		this.horizontalLinearDataChartMeterGadget.push(new ChartItem('Value', [3, 1, 12, -10], 'green', 'lightgreen', true, true, false, 1));
	}

	public generateChartGadgetConfiguration(): ChartMeterConfiguration {
		const chartMeterConfiguration = new ChartMeterConfiguration();
		chartMeterConfiguration.numberFormat = '#.####';
		chartMeterConfiguration.betterValues = 'higher';
		chartMeterConfiguration.chartColour = 'green';
		chartMeterConfiguration.goalColour = 'blue';
		chartMeterConfiguration.defaultGoalValue = 8;
		chartMeterConfiguration.minVisualValue = 0;
		chartMeterConfiguration.maxVisualValue = 20;
		chartMeterConfiguration.levels.push({levelColor: '#ff0000', minValue: 0, maxValue: 2});
		chartMeterConfiguration.levels.push({levelColor: '#FFFF00AA', minValue: 3, maxValue: 5});
		chartMeterConfiguration.levels.push({levelColor: '#00FF00AA', minValue: 6, maxValue: 10});
		chartMeterConfiguration.showHistory = false;
		chartMeterConfiguration.markerForGoal = 'rectRot';
		return chartMeterConfiguration;
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
}
