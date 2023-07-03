import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MeterUtil {

	public getRegionYPos(yAxisLabelItem, level: number) {

		const label = yAxisLabelItem.filter(value => Number(value.label) === level);

		if (label.length > 0) {
			return label[0].y;
		} else {
			const lowerLimit = yAxisLabelItem.filter(value => Number(value.label) < level)[0];
			const higherLimit = yAxisLabelItem.filter(value => Number(value.label) > level)
				.slice(-1)[0];

			if (!lowerLimit) {
				return yAxisLabelItem.slice(-1)[0].y;
			}
			if (!higherLimit) {
				return yAxisLabelItem[0].y;
			}
			return this.range(Number(higherLimit.label), Number(lowerLimit.label), higherLimit.y, lowerLimit.y, Number(level));
		}
	}

	public drawRoundedRect(context, x, y, width, height, radius, lineWidth, lineColor) {
		context.beginPath();
		context.moveTo(x, y + radius);
		context.lineTo(x, y + height - radius);
		context.arcTo(x, y + height, x + radius, y + height, radius);
		context.lineTo(x + width - radius, y + height);
		context.arcTo(x + width, y + height, x + width, y + height - radius, radius);
		context.lineTo(x + width, y + radius);
		context.arcTo(x + width, y, x + width - radius, y, radius);
		context.lineTo(x + radius, y);
		context.arcTo(x, y, x, y + radius, radius);
		context.lineWidth = lineWidth;
		context.strokeStyle = lineColor;
		context.stroke();
		context.closePath();
		context.restore();
	}

	public drawTextPanel(context, text: string, backgroundColor, xPos, yPos, rectWidth, rectHeight, textColor, frameColor, externalPanelWidth, notUseCanvasWidth) {
		const originalFont = context.font;
		const digitalFont = this.getFontSized(54, rectHeight, 'digital-font');
		const dotFont = this.getFontSized(54, rectHeight, 'Helvetica');
		const originalRectWidth = rectWidth;
		let dotsText = undefined;

		context.font = digitalFont;
		context.lineJoin = 'round';
		const textWidth = text ? context.measureText(text).width + 20 : 0;
		rectWidth = Math.max(rectWidth, this.getFrameSize(notUseCanvasWidth ? 0 : context.canvas.width), textWidth);

		if (rectWidth > externalPanelWidth) {
			rectWidth = originalRectWidth;
			dotsText = '..';
			context.font = dotFont;
			text = this.getDottedFormattedText(context, text, rectWidth - context.measureText(dotsText).width / 3, false, false);
			context.font = digitalFont;
		} else if (rectWidth > originalRectWidth) {
			xPos = xPos - (rectWidth - originalRectWidth);
		}

		let frameColorHeight = 0;
		if (frameColor) {
			frameColorHeight = 4;
			// Set rectangle and corner values
			context.fillStyle = backgroundColor;
			context.lineWidth = 18;

			// Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
			context.beginPath();
			context.strokeStyle = frameColor;
			context.strokeRect(xPos - 4, yPos - 4, rectWidth + 8, rectHeight + 8);
			context.closePath();
		}

		context.beginPath();
		context.lineWidth = 3;
		context.fillStyle = backgroundColor;
		context.fillRect(xPos + 4, yPos + frameColorHeight, rectWidth - 8, rectHeight - frameColorHeight * 2);
		context.strokeStyle = '#a9a9a9';
		context.strokeRect(xPos + 4, yPos + frameColorHeight, rectWidth - 8, rectHeight - frameColorHeight * 2);
		context.closePath();
		if (text) {
			context.fillStyle = textColor;
			let actualBoundingBoxAscent = context.measureText(text).actualBoundingBoxAscent / 5;
			if (Number.isNaN(actualBoundingBoxAscent)) {
				actualBoundingBoxAscent = rectHeight * 4.2 / 30;
			}
			const xPosValue = dotsText ? xPos + 10 : (xPos + rectWidth) - context.measureText(text).width - 10;
			context.fillText(text, xPosValue, yPos + rectHeight - actualBoundingBoxAscent);
			if (dotsText) {
				context.font = dotFont;
				actualBoundingBoxAscent = context.measureText(dotsText).actualBoundingBoxAscent / 5;
				context.fillText(dotsText, xPos + context.measureText(text).width + 15, yPos + rectHeight - actualBoundingBoxAscent - 5);
			}
		}
		context.font = originalFont;

	}

	private getFrameSize(canvasWidth) {
		const baseWidth = 936;                   // selected default width for canvas
		const baseFrameSize = 15;                     // default size for font

		const ratio = baseFrameSize / baseWidth;   // calc ratio
		return canvasWidth * ratio;   // get font size based on current width
	}

	public getFontSized(defaultFontSize, availableHeight, fontFamily) {
		const fontBase = 60;                   // selected default available height

		const ratio = defaultFontSize / fontBase;   // calc ratio
		const size = availableHeight * ratio;   // get font size based on current width
		return size.toFixed(0) + 'px ' + fontFamily; // set font
	}

	public getRadius(radius) {
		return 0.22 * radius;
	}

	public getScaledWidthOrHeightValue(value, baseValue, baseOutputValue) {
		return value * baseOutputValue / baseValue;
	}

	public getResponsiveWidthBasedOnAvailableCanvasHeight(availableCanvasHeight, yStartPosition, minWidthValue, startWidthValue, baseHeightValue, baseOutputHeightValue) {
		let width = startWidthValue;
		let calculatedHeight = this.getScaledWidthOrHeightValue(width, baseHeightValue, baseOutputHeightValue);

		while (calculatedHeight + yStartPosition > availableCanvasHeight && width > minWidthValue) {
			width -= width * .05;
			calculatedHeight = this.getScaledWidthOrHeightValue(width, baseHeightValue, baseOutputHeightValue);
		}

		return width < minWidthValue ? minWidthValue : width;
	}

	//adapted from https://blog.poettner.de/2011/06/09/simple-statistics-with-php/
	public median(data) {
		return this.quartile_50(data);
	}

	public quartile_25(data) {
		return this.quartile(data, 0.25);
	}

	public quartile_50(data) {
		return this.quartile(data, 0.5);
	}

	public quartile_75(data) {
		return this.quartile(data, 0.75);
	}

	private quartile(data, q) {
		data = this.Array_Sort_Numbers(data);
		const pos = ((data.length) - 1) * q;
		const base = Math.floor(pos);
		const rest = pos - base;
		if ((data[base + 1] !== undefined)) {
			return data[base] + rest * (data[base + 1] - data[base]);
		} else {
			return data[base];
		}
	}

	private Array_Sort_Numbers(inputarray) {
		return inputarray.sort(function(a, b) {
			return a - b;
		});
	}

	public getTextBackgroundColor(levels, currentValue: number): string {

		const level = levels.filter(value => value.minValue <= currentValue && currentValue <= value.maxValue);

		if (level.length > 0) {
			if (level[0].levelColor.toLowerCase().startsWith('rgba')) {
				return this.RGBAToHexA(level[0].levelColor, false);
			}
			return level[0].levelColor;
		}
		return '#95D9FF';
	}

	public getLevelColor(levelColor: string) {
		if (levelColor.toLowerCase()
			.startsWith('#')) {
			return this.hexAToRGBA(levelColor, 0.25);
		} else if (levelColor.toLowerCase()
			.startsWith('rgb(')) {
			return levelColor.replace('rgb(', 'rgba(')
				.replace(')', ', 0.25)');
		}
		return levelColor;
	}

	private RGBAToHexA(rgba, includeAlpha) {
		let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
		rgba = rgba.substr(5).split(')')[0].split(sep);

		// Strip the slash if using space-separated syntax
		if (rgba.indexOf('/') > -1) rgba.splice(3, 1);

		for (let R in rgba) {
			let r = rgba[R];
			if (r.indexOf('%') > -1) {
				let p = parseFloat(r.substr(0, r.length - 1)) / 100;

				if (parseInt(R) < 3) {
					rgba[R] = Math.round(p * 255);
				} else {
					rgba[R] = p;
				}
			}
		}

		let r = (+rgba[0]).toString(16),
		    g = (+rgba[1]).toString(16),
		    b = (+rgba[2]).toString(16),
		    a = Math.round(+rgba[3] * 255).toString(16);

		if (r.length === 1) r = '0' + r;
		if (g.length === 1) g = '0' + g;
		if (b.length === 1) b = '0' + b;
		if (a.length === 1) a = '0' + a;

		return '#' + r + g + b + (includeAlpha ? a : '');
	}

	private hexAToRGBA(h, alpha) {
		let r = 0,
		    g = 0,
		    b = 0,
		    a = 0;

		if (h.length === 4) {
			r = parseInt('0x' + h[1] + h[1]);
			g = parseInt('0x' + h[2] + h[2]);
			b = parseInt('0x' + h[3] + h[3]);
			a = alpha != null ? alpha : 1.0;
		} else if (h.length === 5) {
			r = parseInt('0x' + h[1] + h[1]);
			g = parseInt('0x' + h[2] + h[2]);
			b = parseInt('0x' + h[3] + h[3]);
			a = parseInt('0x' + h[4] + h[4]) / 255;
			a = +a.toFixed(3);
		} else if (h.length === 7) {
			r = parseInt('0x' + h[1] + h[2]);
			g = parseInt('0x' + h[3] + h[4]);
			b = parseInt('0x' + h[5] + h[6]);
			a = alpha != null ? alpha : 1.0;
		} else if (h.length === 9) {
			r = parseInt('0x' + h[1] + h[2]);
			g = parseInt('0x' + h[3] + h[4]);
			b = parseInt('0x' + h[5] + h[6]);
			a = parseInt('0x' + h[7] + h[8]) / 255;
			a = +a.toFixed(3);
		}

		return `rgba(${r},${g},${b},${a})`;
	}

	public getTextColor(color) {
		const c = color.substring(1);      // strip #
		const rgb = parseInt(c, 16);   // convert rrggbb to decimal
		const r = (rgb >> 16) & 0xff;  // extract red
		const g = (rgb >> 8) & 0xff;  // extract green
		const b = (rgb >> 0) & 0xff;  // extract blue

		const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

		if (luma < 65) {
			return '#FFF';
		}
		return '#174967';
	}

	public getRectWidthBasedOnText(context, rectWidth, rectHeight, text) {
		const originalFont = context.font;
		context.font = this.getFontSized(54, rectHeight, 'digital-font');
		context.lineJoin = "round";

		context.font = originalFont;
		return Math.max(rectWidth, this.getFrameSize(context.canvas.width), context.measureText(text).width + 20);
	}

	private lerp(x, y, a) {
		return x * (1 - a) + y * a;
	}

	private clamp(a, min = 0, max = 1) {
		return Math.min(max, Math.max(min, a));
	}

	private invlerp(x, y, a) {
		return this.clamp((a - x) / (y - x));
	}

	public range(x1, y1, x2, y2, a) {
		return this.lerp(x2, y2, this.invlerp(x1, y1, a));
	}

	public getDottedFormattedText(context, text: string, frameSize, addDots, inverseDots): string {
		const stringArray = text.replace('-', '')
			.split('');
		let returnText = '';

		for (let index of stringArray) {
			if ((context.measureText(returnText + index).width + 30) > frameSize) {
				break;
			} else {
				returnText = returnText + index;
			}
		}

		if ('0' === returnText || !addDots) {
			return returnText;
		} else if (addDots) {
			return inverseDots ? '..' + returnText : returnText + '..';
		}
	}
}
