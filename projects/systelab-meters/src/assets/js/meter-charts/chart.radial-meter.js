import {ChartMeterData, drawTextPanel, getDottedFormattedText, getLevelColor, getRadius, getTextBackgroundColor, getTextColor, hideGoalsAndTooltips, range} from './chart.common-meter-functions';
import {DecimalFormat} from "../decimalFormat";

export const RadialMeter = Chart.controllers.bar.extend({
    buildOrUpdateElements: function () {
        Chart.controllers.bar.prototype.buildOrUpdateElements.apply(this, arguments);
        hideGoalsAndTooltips(this.chart);
    },
    draw: function (ease) {

        if (this.chart.options.chartMeterOptions.showHistory) {
            Chart.controllers.bar.prototype.draw.apply(this, arguments);
        } else {
            const chartMeterData = new ChartMeterData(this._data, this.chart.options.chartMeterOptions);

            const context = this.chart.chart.ctx;
            context.save();
            context.clearRect(0, 0, this.chart.width, this.chart.height);
            const centerX = this.chart.width / 2;
            const centerY = this.chart.height / 2;
            const radius = Math.max(Math.min(this.chart.height / 2 - 10, this.chart.width / 2 - 10), 115);

            const increment = Math.fround(Number((chartMeterData.maxValue - chartMeterData.minValue) / 11));

            this.drawBackground(context, centerX, centerY, radius);
            this.drawLevels(context, radius, chartMeterData.minValue, chartMeterData.maxValue);
            this.drawTicksAndLabels(context, radius, increment, chartMeterData.minValue, chartMeterData.maxValue, chartMeterData.numberFormat, chartMeterData.fractionDigits);

            const textBackgroundColor = getTextBackgroundColor(this.chart.options.chartMeterOptions.levels, this._data[this._data.length - 1]);
            const width = radius * 2 * .35;
            const linearGradient = context.createLinearGradient(0, 0, 0, 75);
            let textValue = chartMeterData.text;

            linearGradient.addColorStop(0, '#ffffff');
            linearGradient.addColorStop(1, textBackgroundColor);

            drawTextPanel(context, textValue, linearGradient, -width / 2, (radius / 5) - 5, width, radius / 5, getTextColor(textBackgroundColor),
                undefined, radius , true);

            this.drawNeedle(context, radius, this._data[this._data.length - 1], chartMeterData.minValue, chartMeterData.maxValue);

            context.restore();
            context.translate(-centerX, -centerY);
        }
    },
    drawBackground: function (context, centerX, centerY, radius) {
        context.beginPath();
        context.fillStyle = this.chart.options.chartMeterOptions.borderColor;
        context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
        context.beginPath();
        context.arc(centerX, centerY, radius - 15, 0, Math.PI * 2, true);
        const gradients = context.createRadialGradient(centerX, centerY, radius - 15, centerX, centerY, radius - getRadius(radius));
        gradients.addColorStop(0, '#a9a9a9');
        gradients.addColorStop(1, '#ffffff');

        context.fillStyle = gradients;
        context.fill();
        context.closePath();
        context.restore();

        context.translate(centerX, centerY);
    },
    drawLevels: function (context, radius, minValue, maxValue) {
        const iniRad = this.convertValueToRad(0, 1);
        const endRad = this.convertValueToRad(10, 1);
        this.chart.options.chartMeterOptions.levels.forEach(level => {

            const minValueRanged = range(minValue, maxValue, 0, 10, level.minValue);
            const maxValueRanged = range(minValue, maxValue, 0, 10, level.maxValue);

            const startAngle = range(0, 10, iniRad, endRad, minValueRanged);
            const endAngle = range(0, 10, iniRad, endRad, maxValueRanged);
            context.beginPath();
            context.arc(0, 0, radius - getRadius(radius), Math.PI / 2 + startAngle, Math.PI / 2 + endAngle, false);
            context.lineWidth = 15;
            context.lineCap = 'butt';
            // level color
            context.strokeStyle = getLevelColor(level.levelColor);
            context.stroke();
            context.closePath();
        });
    },
    drawTicksAndLabels: function (context, radius, increment, minValue, maxValue, numberFormat, fractionDigits) {
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

                const rangedValue = range(0, 10, minValue, maxValue, (index + 25) / 5);

                let textValue;

                if (numberFormat) {
                    textValue = new DecimalFormat(numberFormat).format(rangedValue);
                } else {
                    textValue = rangedValue.toFixed(fractionDigits);
                }

                if (textValue.split('').length > 7) {
                    textValue = (textValue.includes('-') ? '-' : '')
                        .concat(getDottedFormattedText(context, textValue, (radius * 2 * .44) * 0.6, true, false).replace('-',''));
                }
                const divider = index < 5 ? 3 : 2.5 - (fractionDigits * 0.1);
                let wPointX = mySineAngle * (radius - radius / divider);
                const wPointY = myCoosAngle * (radius - radius / 3);
                context.fillStyle = '#000000';

                if (wPointX < 0) {
                    wPointX -= 4;
                } else if (wPointX === 0){
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
    },
    drawNeedle: function (context, radius, value, minValue, maxValue) {

        let rangedValue = range(minValue, maxValue, 0, 10, value);
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
    },
    degToRad: function (angle) {
        // Degrees to radians
        return (angle * Math.PI) / 30;
    },
    convertValueToAngle: function (value) {
        return value * 5 - 25;
    },
    convertValueToRad: function (value, increment) {
        return (((value * increment) * Math.PI) * 30 / 180) + (30 * Math.PI / 180);
    },
    getNeedleRadius: function (contextWidth) {
        const baseWidth = 936;                   // selected default width for canvas
        const baseFrameSize = 20;                     // default size for font

        const radius = Math.max(10, baseFrameSize * contextWidth / baseWidth);   // calc ratio
        return Math.min(radius, baseFrameSize);   // get font size based on current width
    }
});
