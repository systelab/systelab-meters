import { DecimalFormat } from '../../assets/js/decimalFormat';

export class ChartMeterData {
	public min: number;
	public max: number;
	private currentValue: number;
	private numberFormat: string;

	private levels: Array<{ levelColor: string; minValue: number; maxValue: number }>;

	constructor(currentValue: number, min: number, max: number, numberFormat: string, levels: Array<{ levelColor: string; minValue: number; maxValue: number }>) {

		this.currentValue = currentValue;
		this.min = min;
		this.max = max;
		this.numberFormat = numberFormat;
		this.levels = levels;
	}

	public getMinValue() {
		return this.min ?? Math.min(...this.levels.map(value => value.minValue));
	}

	public getMaxValue() {
		return this.max ?? Math.max(...this.levels.map(value => value.maxValue));
	}

	public getTextIncrement(): number {
		return Math.abs((this.getMaxValue() - this.getMinValue())) / 61;
	}

	public getFractionDigits(): number {
		if (this.numberFormat && this.numberFormat.lastIndexOf('.') > 0) {
			if (this.numberFormat.toLowerCase()
				.includes('e')) {
				return Number(this.numberFormat.substring(this.numberFormat.indexOf('.') + 1,
					this.numberFormat.indexOf('e')));
			} else {
				return this.numberFormat.substring(this.numberFormat.indexOf('.') + 1).length;
			}
		} else {
			return (this.getMaxValue() - this.getMinValue()) <= 20 ? 1 : 0;
		}
	}

	public getText(): string {
		if (this.numberFormat) {
			return this.currentValue !== undefined ? new DecimalFormat(this.numberFormat).format(this.currentValue) : '--';
		} else {
			return this.currentValue !== undefined ? this.currentValue.toFixed(this.getFractionDigits()) : '--';
		}
	}

}
