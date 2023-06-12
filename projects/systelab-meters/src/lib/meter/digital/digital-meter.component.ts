import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MeterUtil } from '../meter.util';
import { ChartMeterData } from '../chart-meter.model';

@Component({
	selector:    'systelab-digital-meter',
	templateUrl: './digital-meter.component.html'
})
export class DigitalMeterComponent implements AfterViewInit {
	@ViewChild('canvas', {static: true}) canvas: ElementRef;

	@Input() value: number;

	@Input() min: number;
	@Input() max: number;
	@Input() numberFormat: string;
	@Input() levels: Array<{ levelColor: string; minValue: number; maxValue: number }> = [];

	@Input() borderColor: string;

	constructor(private readonly meterUtil: MeterUtil) {
	}

	public ngAfterViewInit(): void {
		if (this.canvas.nativeElement) {
			const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
			context.canvas.width = this.canvas.nativeElement.parentNode.clientWidth;
			context.canvas.height = this.canvas.nativeElement.parentNode.clientHeight;
			const chartMeterData = new ChartMeterData(this.value, this.min, this.max, this.numberFormat, this.levels);
			this.drawChart(context, chartMeterData);
		}
	}

	private drawChart(context: CanvasRenderingContext2D, chartMeterData: ChartMeterData): void {
		context.save();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		const centerX = context.canvas.width / 2;
		const centerY = context.canvas.height / 2;
		context.moveTo(centerX, centerY);

		const textBackgroundColor = this.meterUtil.getTextBackgroundColor(this.levels, this.value);

		const linearGradient = context.createLinearGradient(0, 0, 0, 75);
		linearGradient.addColorStop(1, textBackgroundColor);
		linearGradient.addColorStop(0, '#ffffff');

		context.font = this.meterUtil.getFontSized(72, centerY / 4, 'digital-font');
		let measuredWidth = Math.max(context.canvas.width * 0.8, context.measureText(chartMeterData.getText()).width + 20);
		if (measuredWidth > context.canvas.width) {
			measuredWidth = context.canvas.width * 0.8;
		}

		this.meterUtil.drawTextPanel(context, chartMeterData.getText(), linearGradient, centerX - measuredWidth / 2, centerY - (centerY / 4), measuredWidth,
			Math.max(60, centerY / 4), this.meterUtil.getTextColor(textBackgroundColor), this.borderColor, context.canvas.width, null);
		context.restore();
	}
}
