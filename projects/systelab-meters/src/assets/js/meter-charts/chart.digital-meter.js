import {ChartMeterData, drawTextPanel, getFontSized, getTextBackgroundColor, getTextColor, hideGoalsAndTooltips} from './chart.common-meter-functions';

export const DigitalMeter = Chart.controllers.bar.extend({
    buildOrUpdateElements: function () {
        Chart.controllers.bar.prototype.buildOrUpdateElements.apply(this, arguments);
        hideGoalsAndTooltips(this.chart);
    },
    draw: function (ease) {
        // Call super method first
        if (this.chart.options.chartMeterOptions.showHistory) {
            Chart.controllers.bar.prototype.draw.apply(this, arguments);
        } else {
            const chartMeterData = new ChartMeterData(this._data, this.chart.options.chartMeterOptions);
            const context = this.chart.chart.ctx;
            context.save();
            context.clearRect(0, 0, this.chart.width, this.chart.height);
            const centerX = this.chart.width / 2;
            const centerY = this.chart.height / 2;

            const textBackgroundColor = getTextBackgroundColor(this.chart.options.chartMeterOptions.levels, this._data[this._data.length - 1]);

            context.moveTo(centerX, centerY);
            const linearGradient = context.createLinearGradient(0, 0, 0, 75);

            linearGradient.addColorStop(1, textBackgroundColor);
            linearGradient.addColorStop(0, '#ffffff');

            context.font = getFontSized(72, centerY / 4, 'digital-font');
            let measuredWidth = Math.max(this.chart.width * 0.8, context.measureText(chartMeterData.text).width + 20);

            if (measuredWidth > this.chart.width) {
                measuredWidth = this.chart.width * 0.8;
            }
            drawTextPanel(context, chartMeterData.text, linearGradient, centerX - measuredWidth / 2, centerY - (centerY / 4), measuredWidth,
                Math.max(60, centerY / 4), getTextColor(textBackgroundColor), this.chart.options.chartMeterOptions.borderColor, this.chart.width);
            context.restore();

        }
    }
});
