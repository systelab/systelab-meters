# systelab-meter

Component to show a Meter widget

## Using the component

```html

<systelab-meter [labels]="labels" [data]="data" [showLegend]="legend" [(itemSelected)]="itemSelected" [type]="type"
                (action)="doAction($event)" [isBackgroundGrid]="isBackgroundGrid" [isHorizontal]="isHorizontal" [lineTension]="lineTension"
                [yMinValue]="yMinValue" [yMaxValue]="yMaxValue" [annotations]="annotations" [xLabelAxis]="xLabelAxis" [yLabelAxis]="yLabelAxis"
                [tooltipSettings]="tooltipSettings" [isStacked]="isStacked" [customLegend]="customLegend"
                [chartMeterConfiguration]="chartMeterConfiguration"
></systelab-meter>
```

This component use the **Chart.js** library, and is able to display different chart types in an easy way.

Set **type** with the chart type that you want to display. You can choose between the following charts types

- Digital Meter
- Radial Meter
- Linear Meter (horizontal / vertical)



## Properties

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| labels | Array<string> | | list of labels of the chart |
| yMinValue | any | 0 | Min value of the axis Y |
| yMaxValue | any | 0 | Max value of the axis Y |
| xMinValue | any | 0 | Min value of the axis X |
| xMaxValue | any | 0 | Max value of the axis X |
| xLabelAxis | string | 0 | Define the title of the Axis X |
| yLabelAxis | string | 0 | Define the title of the Axis Y |
| isHorizontal | boolean | false | Set to true, if you want that display a bar chart in horizontal view |
| isStacked | boolean | false | Set to true, if you want that display a bar chart with stacked columns |
| data | Array<ChartItem> |  | List of data |
| hideInitialAndFinalTick | boolean | false | Remove the first and last tick in every axis|
| hideFinalTick | boolean | false | Remove the last tick in every axis|

#### ChartItem

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| label | string | | Label name of the item |
| data | Array<any> | | List of values of the item |
| borderColor | string |  | Color in Hexadecimal for the border |
| backgroundColor | string |  | Color in Hexadecimal for the background |
| fill | boolean | true | Set to false if you want a transparent background |
| showLine | boolean | true | Set to false if you only want to display the area and not the border |
| isGradient | boolean | false | Set to true if you want to use a gradient colours |
| borderWidth | string |  | Define the width of the border |
| chartType | string |  | Define different chart type to mix charts |
| chartTooltipItem | ChartTooltipItem or Array<ChartTooltipItem> |  | Define what you want to display in the tooltip of this raw data or a custom tooltip for each point of this raw data. |
| pointRadius | number | 3 | The radius of the point shape. If set to 0, the point is not rendered. |
| yAxisID | string |  | Define the ID of the y axis to plot this dataset on. |
| legendType | string |  | Define legend type, it can be 'bar,' 'line' or 'dots'. It is only used if the [customLegend] property is true |
| labelBorderColors | Array<number[]> |  | If the ChartItem belongs to a Doughnut, Pie or Polar Area chart, this property contains a list of colors in RGB for the border of every value and every RGB color is expressed as an array of three numbers. If not defined, a default set of colors will be used instead|
| labelBackgroundColors | Array<number[]> |  | As the [labelBorderColors] property, but it refers to the background color of every value. Like [labelBorderColors], if not defined a default set of colors will be used instead|


##### ChartMeterConfiguration

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| borderColor | string |'#007bff'| The border color applied to the graph |
| numberFormat | string | | The number format to apply the values |
| chartColour | string | | The color for the bars in the history chart |
| goalColour | string | | The color for the goal values in the history chart |
| betterValues | string | | Pending description |
| | | | Supported values are: |
| | | | 'higher' (default): the higher values are the better ones |
| | | | 'lower' : the lower values are the better ones |
| markerForGoal | string | | The marker for the goal value in the history chart|
| | | | Supported values are: |
| | | | 'circle' (default), 'cross', 'crossRot', 'dash', 'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle'
| defaultGoalValue | number | | The default goal value in case that there's no list of goal values |
| minVisualValue | number | | Value as a lower limit in the graphs. If not informed the min value will be de lower value in the dataset|
| maxVisualValue | number | | Value as a higher limit in the graphs. If not informed the max value will be de lower value in the dataset|
| showHistory | boolean | false | Show the history graph by default|
| levels | object | | List of levels to be included in the graphs |

Definition of a level parameter as an object:

```javascript
type
Levels = {
	levelColor: string,
	minValue:   number,
	maxValue:   number
};
```

Use the next @font-face declaration in your scss in order to use the digital font in the meter graphs:

```scss
@font-face {
  font-family: 'digital-font';
  src: url('~systelab-meters/assets/fonts/Segment7Standard.otf') format('opentype');
  font-style: normal;
}
```

## Events

| Name | Parameters | Description |
| ---- |:----------:| ------------|
| doUpdate | | Reset the chart with the new data.|
|action| |Is going to emit the event when you clicked in a item in the chart|


**Note**: _responsive_ and _maintainAspectRatio_ parameters must be set to _**false**_.
