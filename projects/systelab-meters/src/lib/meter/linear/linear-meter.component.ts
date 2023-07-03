import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartMeterData } from '../chart-meter.model';
import { DecimalFormat } from '../../../assets/js/decimalFormat';
import { MeterUtil } from '../meter.util';

@Component({
	selector:    'systelab-linear-meter',
	templateUrl: './linear-meter.component.html'
})
export class LinearMeterComponent implements AfterViewInit {
	@ViewChild('canvas', {static: true}) canvas: ElementRef;

	@Input() value: number;

	@Input() min: number;
	@Input() max: number;
	@Input() numberFormat: string;
	@Input() levels: Array<{ levelColor: string; minValue: number; maxValue: number }> = [];

	@Input() borderColor: string;

	@Input() isHorizontal = false;

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

	private drawChart(context: CanvasRenderingContext2D, chartMeterData: ChartMeterData) {
		context.save();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		const centerX = context.canvas.width / 2;
		const centerY = context.canvas.height / 2;
		const roundRectBorderRadius = 12;

		context.moveTo(centerX, centerY);

		if (this.isHorizontal) {

			const externalPanelWidth = this.meterUtil.getResponsiveWidthBasedOnAvailableCanvasHeight(context.canvas.height, centerY - (centerY / 3), 500,
				Math.max(500, centerX + centerX / 2), 660, 180);
			const externalPanelHeight = this.meterUtil.getScaledWidthOrHeightValue(externalPanelWidth, 660, 180);

			const textPanelWidth = this.meterUtil.getScaledWidthOrHeightValue(externalPanelWidth, 200, 45);
			const textPanelHeight = this.meterUtil.getScaledWidthOrHeightValue(textPanelWidth, 120, 30);

			const textPanelYPos = centerY - (externalPanelHeight / 2) + 15;
			const increment = Math.max(7, externalPanelWidth / 65);
			const ticksLabelsXStartPos = centerX - (externalPanelWidth / 2) + increment * 2.5;

			const linearGradient = context?.createLinearGradient(centerX - (externalPanelWidth / 2), centerY - (externalPanelHeight / 2), centerX - (externalPanelWidth / 2), centerY + (externalPanelHeight / 2));
			linearGradient.addColorStop(0, '#d3d3d3');
			linearGradient.addColorStop(0.20, '#ffffff');
			linearGradient.addColorStop(0.80, '#ffffff');
			linearGradient.addColorStop(1, '#d3d3d3');

			context.fillStyle = linearGradient;
			context.fillRect(centerX - (externalPanelWidth / 2), centerY - (externalPanelHeight / 2), externalPanelWidth, externalPanelHeight);

			this.meterUtil.drawRoundedRect(context, centerX - (externalPanelWidth / 2), centerY - (externalPanelHeight / 2), externalPanelWidth, externalPanelHeight, roundRectBorderRadius, 10,
				this.borderColor);

			this.drawHorizontalTicksLabelsBar(context, this.value, ticksLabelsXStartPos,
				textPanelYPos + textPanelHeight + textPanelHeight / 2, externalPanelHeight,
				increment, chartMeterData.getMinValue(), chartMeterData.getMaxValue(), chartMeterData.getTextIncrement(), this.numberFormat, chartMeterData.getFractionDigits());

			this.meterUtil.drawTextPanel(context, chartMeterData.getText(), this.meterUtil.getTextBackgroundColor(this.levels, this.value), (ticksLabelsXStartPos + increment * 60) - textPanelWidth * 1.5 + 7, textPanelYPos,
				textPanelWidth * 1.5, textPanelHeight, this.meterUtil.getTextColor(this.meterUtil.getTextBackgroundColor(this.levels, this.value))
				, undefined, undefined, false);

		} else { // Vertical
			const textPanelHeight = Math.max(30, centerY / 8);
			const textPanelWidth = Math.max(100, centerX / 3);

			const externalPanelHeight = Math.max(365, context.canvas.height * 0.9);
			const externalPanelWidth = Math.max(130, this.meterUtil.getRectWidthBasedOnText(context, textPanelWidth, textPanelHeight, chartMeterData.getText()) * 2);

			const calculatedYPos = Math.max(333, externalPanelHeight - textPanelHeight - 20);

			const linearGradient = context?.createLinearGradient(centerX - externalPanelWidth / 2, 15, (centerX - externalPanelWidth / 2) + externalPanelWidth, 15);
			linearGradient.addColorStop(0, '#d3d3d3');
			linearGradient.addColorStop(0.20, '#ffffff');
			linearGradient.addColorStop(0.80, '#ffffff');
			linearGradient.addColorStop(1, '#d3d3d3');

			context.fillStyle = linearGradient;
			context.fillRect(centerX - externalPanelWidth / 2, 15, externalPanelWidth, externalPanelHeight);

			this.meterUtil.drawRoundedRect(context, centerX - externalPanelWidth / 2, 15, externalPanelWidth,
				externalPanelHeight, roundRectBorderRadius, 10, this.borderColor);

			this.meterUtil.drawTextPanel(context, chartMeterData.getText(), this.meterUtil.getTextBackgroundColor(this.levels, this.value), (centerX - externalPanelWidth / 2) + 10,
				calculatedYPos + 15, externalPanelWidth - 20, textPanelHeight, this.meterUtil.getTextColor(this.meterUtil.getTextBackgroundColor(this.levels, this.value)), undefined, externalPanelWidth - 20, false);

			const increment = externalPanelHeight * 6.75 / 495;
			const panelsSeparation = 15 * textPanelHeight / 30;
			const originalCanvasDir = context.canvas.dir;
			context.canvas.dir = 'rtl';
			this.drawVerticalTicksLabelsBar(context, this.value, (centerX - externalPanelWidth / 3) - 20,
				externalPanelHeight - textPanelHeight - panelsSeparation, textPanelWidth,
				increment, chartMeterData.getMinValue(), chartMeterData.getMaxValue(), chartMeterData.getTextIncrement(), this.numberFormat,
				chartMeterData.getFractionDigits(), externalPanelWidth - 20);
			context.canvas.dir = originalCanvasDir;
		}
		context.restore();
	}

	private drawHorizontalTicksLabelsBar(context: CanvasRenderingContext2D, valueToPrint, xStartPos: number, yStartPos: number, panelHeight: number, increment, minValue, maxValue, textIncrement, numberFormat, fractionDigits) {
		context.beginPath();
		context.strokeStyle = '#000000';
		context.fillStyle = '#000000';
		const calculatedHeightForPanels = Math.max(35, panelHeight / 3.5);
		const calculatedYPos = yStartPos + calculatedHeightForPanels + 20;
		context.font = this.meterUtil.getFontSized(14, calculatedHeightForPanels, 'Helvetica');
		const textGap = 25 * calculatedHeightForPanels / 70;
		let valueToPrintXPos;

		for (let index = 0; index <= 60; index++) {
			let labelTextValueXPos = xStartPos + index * increment;
			let textValue = this.getTextValue(minValue + index * textIncrement, numberFormat, fractionDigits);
			textValue = this.getTextValueForLimits(index, textValue, minValue, maxValue, numberFormat);
			if (Number(textValue) === valueToPrint) {
				valueToPrintXPos = labelTextValueXPos;
			}
			if (context.measureText(textValue).width > 4 * increment) {
				if (index === 0) {
					labelTextValueXPos += 15;
				} else if (index === 60) {
					labelTextValueXPos -= 20;
				}
				textValue = (textValue.includes('-') ? '-' : '').concat(this.meterUtil.getDottedFormattedText(context, textValue, 10 * increment, true, false));
			}
			switch (index % 10) {
				case 0:
					context.lineWidth = 2.5;
					context.fillText(textValue, labelTextValueXPos - context.measureText(textValue).width / 2, calculatedYPos + textGap);
					context.beginPath();
					context.moveTo(xStartPos + index * increment, calculatedYPos - 10);
					context.lineTo(xStartPos + index * increment, calculatedYPos + 5);
					context.stroke();
					context.closePath();
					break;
				case 5:
					context.lineWidth = 1.5;
					context.beginPath();
					context.moveTo(xStartPos + index * increment, calculatedYPos - 10);
					context.lineTo(xStartPos + index * increment, calculatedYPos + 2);
					context.stroke();
					context.closePath();
					break;
				default:
					context.lineWidth = 0.7;
					context.beginPath();
					context.moveTo(xStartPos + index * increment, calculatedYPos - 10);
					context.lineTo(xStartPos + index * increment, calculatedYPos - 1);
					context.stroke();
					context.closePath();
					break;
			}
		}

		this.meterUtil.drawTextPanel(context, undefined, '#ffffff', xStartPos - 5, yStartPos, increment * 61, calculatedHeightForPanels,
			undefined, undefined, undefined, false);

		const firstValue = Number(this.getTextValue(minValue, numberFormat, fractionDigits));
		const lastValue = Number(this.getTextValue(maxValue, numberFormat, fractionDigits));
		const lastValueXPosition = xStartPos + 60 * increment;
		if (!valueToPrintXPos) {
			valueToPrintXPos = this.meterUtil.range(firstValue, lastValue, xStartPos, lastValueXPosition, valueToPrint);
		}
		if (valueToPrint > minValue) {
			context.beginPath();
			context.lineWidth = 2;
			context.fillStyle = this.meterUtil.getTextBackgroundColor(this.levels, valueToPrint);
			context.fillRect(xStartPos, yStartPos + 1, (valueToPrint > maxValue ? lastValueXPosition + 1 : valueToPrintXPos) - xStartPos - 1, calculatedHeightForPanels - 2);
			context.closePath();
		}
	}

	private drawVerticalTicksLabelsBar(context: CanvasRenderingContext2D, valueToPrint, xStartPos, yStartPos, panelWidth, increment, minValue, maxValue, textIncrement, numberFormat, fractionDigits, textPanelWidth) {
		context.beginPath();
		context.strokeStyle = '#000000';
		context.font = this.meterUtil.getFontSized(6, panelWidth, 'Helvetica');
		context.fillStyle = '#000000';
		const calculatedYPos = Math.max(333, yStartPos);

		let valueToPrintYPos;
		let maxTextLabelWidth = 0;

		for (let index = 0; index <= 60; index += 10) {
			const textValue = this.getTextValue(minValue + index * textIncrement, numberFormat, fractionDigits);
			maxTextLabelWidth = Math.max(maxTextLabelWidth, context.measureText(textValue).width * 1.525);
		}

		if (maxTextLabelWidth > textPanelWidth / 2) {
			maxTextLabelWidth = textPanelWidth / 2;
		}

		const xMoveToPos = xStartPos + 10 + maxTextLabelWidth;

		for (let index = 0; index <= 60; index++) {
			let textValue = this.getTextValue(minValue + index * textIncrement, numberFormat, fractionDigits);
			textValue = this.getTextValueForLimits(index, textValue, minValue, maxValue, numberFormat);
			if (Number(textValue) === valueToPrint) {
				valueToPrintYPos = calculatedYPos - index * increment;
			}
			if (context.measureText(textValue).width > maxTextLabelWidth - 10) {
				textValue = this.meterUtil.getDottedFormattedText(context, textValue, maxTextLabelWidth, true, true)
					.concat(textValue.includes('-') ? '-' : '');
			}
			switch (index % 10) {
				case 0:
					let actualBoundingBoxAscent = context.measureText(textValue).actualBoundingBoxAscent / 2;
					if (Number.isNaN(actualBoundingBoxAscent)) {
						actualBoundingBoxAscent = panelWidth * 4 / 114.625;
					}
					if (textValue.includes('-')) {
						textValue = textValue.replace('-', '') + '-';
					}
					context.lineWidth = 2.5;
					context.fillText(textValue, xStartPos + maxTextLabelWidth - 8, calculatedYPos - index * increment + actualBoundingBoxAscent);
					context.beginPath();
					context.moveTo(xMoveToPos, calculatedYPos - index * increment);
					context.lineTo(xStartPos + maxTextLabelWidth, calculatedYPos - index * increment);
					context.stroke();
					context.closePath();
					break;
				case 5:
					context.lineWidth = 1.5;
					context.beginPath();
					context.moveTo(xMoveToPos, calculatedYPos - index * increment);
					context.lineTo(xStartPos + maxTextLabelWidth + 2, calculatedYPos - index * increment);
					context.stroke();
					context.closePath();
					break;
				default:
					context.lineWidth = 0.7;
					context.beginPath();
					context.moveTo(xMoveToPos, calculatedYPos - index * increment);
					context.lineTo(xStartPos + maxTextLabelWidth + 5, calculatedYPos - index * increment);
					context.stroke();
					context.closePath();
					break;
			}
		}
		const linearGradient = context.createLinearGradient(0, 100, 0, 50);

		linearGradient.addColorStop(0.5, '#d3d3d3');
		linearGradient.addColorStop(1, '#808080');

		const calculatedBarWidth = textPanelWidth - (xMoveToPos - xStartPos) - this.getSubtractValue(212, 20, textPanelWidth) * 1.25;
		this.meterUtil.drawTextPanel(context, undefined, '#ffffff', xStartPos + 20 + maxTextLabelWidth, calculatedYPos - increment * 60,
			calculatedBarWidth, increment * 60, undefined, undefined, undefined, false);

		const firstValue = Number(this.getTextValue(minValue, numberFormat, fractionDigits));
		const lastValue = Number(this.getTextValue(minValue + 60 * textIncrement, numberFormat, fractionDigits));
		const lastValueYPosition = calculatedYPos - 60 * increment;
		if (!valueToPrintYPos) {
			valueToPrintYPos = this.meterUtil.range(lastValue, firstValue, lastValueYPosition, calculatedYPos, valueToPrint);
		}
		if (valueToPrint > minValue) {
			context.beginPath();
			context.lineWidth = 1;
			context.fillStyle = this.meterUtil.getTextBackgroundColor(this.levels, valueToPrint);
			context.fillRect(xStartPos + 26 + maxTextLabelWidth, valueToPrintYPos + 1, calculatedBarWidth - 11, calculatedYPos - valueToPrintYPos - 2);
			context.closePath();
		}
	}

	private getSubtractValue(referenceValue: number, referenceSubtract: number, newValue: number): number {
		return (newValue * referenceSubtract) / referenceValue;
	}

	private getTextValue(value: number, numberFormat: string, fractionDigits: number): string {
		if (numberFormat) {
			return new DecimalFormat(numberFormat).format(value);
		} else {
			return (value).toFixed(fractionDigits);
		}
	}

	private getTextValueForLimits(index: number, originalTextValue, minValue, maxValue, numberFormat): string {
		const medianValue = this.meterUtil.median([minValue, maxValue]);

		if (numberFormat) {
			switch (index) {
				case 0:
					return new DecimalFormat(numberFormat).format(minValue);
				case 10:
					return new DecimalFormat(numberFormat).format(this.meterUtil.quartile_25([minValue, medianValue]));
				case 20:
					return new DecimalFormat(numberFormat).format(this.meterUtil.quartile_75([minValue, medianValue]));
				case 30:
					return new DecimalFormat(numberFormat).format(medianValue);
				case 40:
					return new DecimalFormat(numberFormat).format(this.meterUtil.quartile_25([medianValue, maxValue]));
				case 50:
					return new DecimalFormat(numberFormat).format(this.meterUtil.quartile_75([medianValue, maxValue]));
				case 60:
					return new DecimalFormat(numberFormat).format(maxValue);
				default:
					return originalTextValue;
			}
		}
		return originalTextValue;
	}
}

