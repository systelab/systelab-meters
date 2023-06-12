import { Component } from '@angular/core';

@Component({
	selector:    'showcase-meter',
	templateUrl: './showcase-meter.component.html'
})
export class ShowcaseMeterComponent {

	public levels: Array<{ levelColor: string; minValue: number; maxValue: number }> = [];

	constructor() {
		this.levels.push({levelColor: '#ff0000', minValue: 0, maxValue: 2});
		this.levels.push({levelColor: '#FFFF00AA', minValue: 3, maxValue: 5});
		this.levels.push({levelColor: '#00FF00AA', minValue: 6, maxValue: 10});
	}
}
