import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartMeterData } from '../chart-meter.model';
import { DecimalFormat } from '../../../assets/js/decimalFormat';
import { MeterUtil } from '../meter.util';

@Component({
	selector:    'systelab-radial-meter',
	templateUrl: './radial-meter.component.html'
})
export class RadialMeterComponent implements AfterViewInit {
	@ViewChild('canvas', {static: true}) canvas: ElementRef;

	@Input() value: number;
	@Input() min: number;
	@Input() max: number;
	@Input() numberFormat: string;

	@Input() borderColor: string;

	@Input() levels: Array<{ levelColor: string; minValue: number; maxValue: number }> = [];

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
		const radius = Math.max(Math.min(context.canvas.height / 2 - 10, context.canvas.width / 2 - 10), 115);

		const increment = Math.fround(Number((chartMeterData.getMaxValue() - chartMeterData.getMinValue()) / 11));

		this.drawBackground(context, centerX, centerY, radius);
		this.drawLevels(context, radius, chartMeterData.getMinValue(), chartMeterData.getMaxValue());
		this.drawTicksAndLabels(context, radius, increment, chartMeterData.getMinValue(), chartMeterData.getMaxValue(), this.numberFormat, chartMeterData.getFractionDigits());

		const textBackgroundColor = this.meterUtil.getTextBackgroundColor(this.levels, this.value);
		const width = radius * 2 * .35;
		const linearGradient = context.createLinearGradient(0, 0, 0, 75);
		linearGradient.addColorStop(0, '#ffffff');
		linearGradient.addColorStop(1, textBackgroundColor);

		this.meterUtil.drawTextPanel(context, chartMeterData.getText(), linearGradient, -width / 2, (radius / 5) - 5, width, radius / 5, this.meterUtil.getTextColor(textBackgroundColor),
			undefined, radius, true);

		this.drawNeedle(context, radius, this.value, chartMeterData.getMinValue(), chartMeterData.getMaxValue());

		context.restore();
		context.translate(-centerX, -centerY);
	}

	private drawBackground(context: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void {
		context.beginPath();
		context.fillStyle = this.borderColor;
		context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(centerX, centerY, radius - 15, 0, Math.PI * 2, true);
		const gradients = context.createRadialGradient(centerX, centerY, radius - 15, centerX, centerY, radius - this.meterUtil.getRadius(radius));
		gradients.addColorStop(0, '#a9a9a9');
		gradients.addColorStop(1, '#ffffff');

		context.fillStyle = gradients;
		context.fill();
		context.closePath();
		context.restore();

		context.translate(centerX, centerY);
	}

	private drawLevels(context: CanvasRenderingContext2D, radius: number, minValue: number, maxValue: number): void {
		const iniRad = this.convertValueToRad(0, 1);
		const endRad = this.convertValueToRad(10, 1);
		this.levels.forEach(level => {

			const minValueRanged = this.meterUtil.range(minValue, maxValue, 0, 10, level.minValue);
			const maxValueRanged = this.meterUtil.range(minValue, maxValue, 0, 10, level.maxValue);

			const startAngle = this.meterUtil.range(0, 10, iniRad, endRad, minValueRanged);
			const endAngle = this.meterUtil.range(0, 10, iniRad, endRad, maxValueRanged);
			context.beginPath();
			context.arc(0, 0, radius - this.meterUtil.getRadius(radius), Math.PI / 2 + startAngle, Math.PI / 2 + endAngle, false);
			context.lineWidth = 15;
			context.lineCap = 'butt';
			// level color
			context.strokeStyle = this.meterUtil.getLevelColor(level.levelColor);
			context.stroke();
			context.closePath();
		});
	}

	private drawTicksAndLabels(context: CanvasRenderingContext2D, radius: number, increment: number, minValue: number, maxValue: number, numberFormat, fractionDigits): void {
		context.beginPath();
		context.strokeStyle = '#000000';
		context.font = '12px Helvetica';

		for (let index = -28; index <= 28; index++) {
			const my30Angle = this.degToRad(index); // Math.PI / 30 * i;
			const mySineAngle = Math.sin(my30Angle);
			const myCoosAngle = -Math.cos(my30Angle);
			let iPointX;
			let iPointY;
			let oPointX;
			let oPointY;

			if (index % 5 === 0) {
				context.lineWidth = 4;
				iPointX = mySineAngle * (radius - radius / 4);
				iPointY = myCoosAngle * (radius - radius / 4);
				oPointX = mySineAngle * (radius - radius / 7);
				oPointY = myCoosAngle * (radius - radius / 7);

				const rangedValue = this.meterUtil.range(0, 10, minValue, maxValue, (index + 25) / 5);

				let textValue;

				if (numberFormat) {
					textValue = new DecimalFormat(numberFormat).format(rangedValue);
				} else {
					textValue = rangedValue.toFixed(fractionDigits);
				}

				if (textValue.split('').length > 7) {
					textValue = (textValue.includes('-') ? '-' : '')
						.concat(this.meterUtil.getDottedFormattedText(context, textValue, (radius * 2 * .44) * 0.6, true, false)
							.replace('-', ''));
				}
				const divider = index < 5 ? 3 : 2.5 - (fractionDigits * 0.1);
				let wPointX = mySineAngle * (radius - radius / divider);
				const wPointY = myCoosAngle * (radius - radius / 3);
				context.fillStyle = '#000000';

				if (wPointX < 0) {
					wPointX -= 4;
				} else if (wPointX === 0) {
					wPointX -= context.measureText(textValue).width / 2;
				} else {
					wPointX -= context.measureText(textValue).width / 2.5;
				}

				context.fillText(textValue, wPointX - 4, wPointY + 4);

			} else if (index > -25 && index < 25) {
				context.lineWidth = 1;
				iPointX = mySineAngle * (radius - radius / 5.5);
				iPointY = myCoosAngle * (radius - radius / 5.5);
				oPointX = mySineAngle * (radius - radius / 7);
				oPointY = myCoosAngle * (radius - radius / 7);
			}

			if (index === -27 || index === 27) {
				iPointX = mySineAngle * (radius - radius / 4);
				iPointY = myCoosAngle * (radius - radius / 4);
				context.beginPath();
				context.fillStyle = '#a9a9a9';
				context.arc(iPointX, iPointY, 8, 0, 2 * Math.PI, false);
				context.fill();
				context.closePath();
				context.beginPath();
				context.fillStyle = '#d3d3d3';
				context.arc(iPointX, iPointY, 6, 0, 2 * Math.PI, false);
				context.fill();
				context.closePath();
			} else {
				context.beginPath();
				context.moveTo(iPointX, iPointY);
				context.lineTo(oPointX, oPointY);
				context.stroke();
				context.closePath();
			}
		}
	}

	private drawNeedle(context: CanvasRenderingContext2D, radius: number, value: number, minValue: number, maxValue: number) {

		let rangedValue = this.meterUtil.range(minValue, maxValue, 0, 10, value);
		if (value > maxValue) {
			rangedValue += 0.25;
		} else if (value < minValue) {
			rangedValue -= 0.25;
		}
		const angle = this.degToRad(this.convertValueToAngle(rangedValue));
		const sineAngle = Math.sin(angle);
		const cosAngle = -Math.cos(angle);
		const pointX = sineAngle * (3 / 4 * radius);
		const pointY = cosAngle * (3 / 4 * radius);

		context.beginPath();
		context.strokeStyle = '#000000';
		context.lineWidth = 6;
		context.lineCap = 'round';
		context.lineJoin = 'round';
		context.moveTo(0, 0);
		context.lineTo(pointX, pointY);
		context.stroke();
		context.closePath();

		context.beginPath();
		context.strokeStyle = '#000000';
		context.fillStyle = '#a9a9a9';
		context.arc(0, 0, this.getNeedleRadius(context.canvas.width), 0, 2 * Math.PI, true);
		context.fill();
		context.closePath();
	}

	private degToRad(angle: number): number {
		// Degrees to radians
		return (angle * Math.PI) / 30;
	}

	private convertValueToAngle(value: number): number {
		return value * 5 - 25;
	}

	private convertValueToRad(value: number, increment: number): number {
		return (((value * increment) * Math.PI) * 30 / 180) + (30 * Math.PI / 180);
	}

	private getNeedleRadius(contextWidth: number): number {
		const baseWidth = 936;                   // selected default width for canvas
		const baseFrameSize = 20;                     // default size for font

		const radius = Math.max(10, baseFrameSize * contextWidth / baseWidth);   // calc ratio
		return Math.min(radius, baseFrameSize);   // get font size based on current width
	}
}
