# systelab-meter

Component to show a Meter widget

## Using the component

```html

<systelab-chart [labels]="labels" [data]="data" [showLegend]="legend" [(itemSelected)]="itemSelected" [type]="type"
                (action)="doAction($event)" [isBackgroundGrid]="isBackgroundGrid" [isHorizontal]="isHorizontal" [lineTension]="lineTension"
                [yMinValue]="yMinValue" [yMaxValue]="yMaxValue" [annotations]="annotations" [xLabelAxis]="xLabelAxis" [yLabelAxis]="yLabelAxis"
                [tooltipSettings]="tooltipSettings" [isStacked]="isStacked" [customLegend]="customLegend"
                [chartMeterConfiguration]="chartMeterConfiguration"
                [timeScale]="isTimeScaleChart"
                [timeUnit]="'month'"
                [tooltipTimeFormat]="'d, MMMM yyyy'"
></systelab-chart>
```

This component use the **Chart.js** library, and is able to display different chart types in an easy way.

Set **type** with the chart type that you want to display. You can choose between the following charts types

- Digital Meter
- Radial Meter
- Linear Meter (horizontal / vertical)

Also, you can show together different chart types (less the meter ones); for example a Bar chart with Line chart. In order to do this, you should define the chart type in the properties of the data that you provide to the component.

Single example:

```javascript
    this.dataLine.push(new chartItem('Only Line', [13, 20, 21, 15], '', '', false, true, false, 3));
```

Multiple charts example:

```javascript
    this.dataLineBar.push(new chartItem('Line', [13, 20, 21, 15], '', '', false, true, true, 3, 'line'));
```

## Properties

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| labels | Array<string> | | list of labels of the chart |
| **itemSelected** | any | | is used to notify which item is clicked |
| showLegend | boolean | true | Define the visibility of the legend |
| legendPosition | string | 'top' | Define the position of the legend |
| isBackgroundGrid | boolean | true | Define if you want a grid background or not |
| lineTension | number | 0 | Define the tension of the line |
| yMinValue | any | 0 | Min value of the axis Y |
| yMaxValue | any | 0 | Max value of the axis Y |
| xMinValue | any | 0 | Min value of the axis X |
| xMaxValue | any | 0 | Max value of the axis X |
| xLabelAxis | string | 0 | Define the title of the Axis X |
| yLabelAxis | string | 0 | Define the title of the Axis Y |
| minValueForRadar | number | 0 | Min value for the radar |
| maxValueForRadar | number | 0 | Max value for the radar |
| isHorizontal | boolean | false | Set to true, if you want that display a bar chart in horizontal view |
| isStacked | boolean | false | Set to true, if you want that display a bar chart with stacked columns |
| data | Array<ChartItem> |  | List of data |
| multipleYAxisScales | Array<ChartMultipleYAxisScales> |  | List of Y axis scales |
| customLegend | boolean | false | Define if you want a custom Legend (remember set legendType in chartItem) |
| hideInitialAndFinalTick | boolean | false | Remove the first and last tick in every axis|
| hideFinalTick | boolean | false | Remove the last tick in every axis|
| timeScale | boolean | false | Define the chart as a time line chart|
| timeUnit | string | day | Define the unit that will be showed the data in Axis X (the format is the same as defined in [Chart.js](https://www.chartjs.org/docs/2.9.4/axes/cartesian/time.html#display-formats)) |
| tooltipTimeFormat | string | d/M/yyyy | Define the time format that will be showed in tooltips (the format is the same as defined in the [date-fns](https://date-fns.org/v2.28.0/docs/format/)) |

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

#### ChartMultipleYAxisScales

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| id | string| | Y axis ID |
| position | string | left | Axis position |
| type | string |  | Chart type |
| gridLines | GridLine |  | Display the grid lines |
| scaleLabel | ScaleLabel | | Show an axis label |
| ticks | Ticks | | Define the values and steps for the axis |

### GridLine

| Name | Type | Default | Description |
| ---- |:----:|:------: | --------- |
| display | boolean | true | Set true if you want to see the grid lines |
| drawBorder | boolean | true | Set true if you want to see a border around the grid|

### ScaleLabel

| Name | Type | Default | Description |
| ---- |:----:|:------: | --------- |
| display | boolean | true | Show the label |
| labelString | string | | Set a text to be shown in the axis |

### Ticks

| Name | Type | Default | Description |
| ---- |:----:|:------: | --------- |
| min | number | | Min value for the axis |
| max | number | | Max value for the axis |
| stepSize | number | | Set the steps between axis values |
| display | boolean | true | Set to false if you do not want to see the ticks on the axis |

### Annotations

You can define two types of annotations, line or box type annotations.

**annotations** is an array of annotations. Depending on the annotations that you want you show, use the **chartBoxAnnotation** structure or **chartLineAnnotation**.

#### chartBoxAnnotation

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| drawTime | string| | Set to draw 'afterDatasetsDraw' or 'beforeDatasetsDraw' |
| type | string | | In this case will be 'box' |
| xMin | number |  | Min value in the axis X |
| xMax | number |  | Max value in the axis X |
| yMin | number |  | Min value in the axis Y |
| yMax | number |  | Max value in the axis Y |
| backgroundColor | string | | Define the color of the box area |
| borderColor | string |  | Define the width of the border |
| borderWidth | string |  | Define the color of the box |

#### chartLineAnnotation

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| label | chartLabelAnnotation| | chartLabelAnnotation are the properties of the tooltip label |
| value | number | | In this case will be 'box' |
| orientation | string |  | Define the orientation can be 'vertical' or horizontal |
| drawTime | string |  | Set to draw 'afterDatasetsDraw' or 'beforeDatasetsDraw' |
| type | string |  | In this case will be 'line' |
| borderDash | Array<number> |  | If you want a dashed line you will establish the dash properties in a number array |
| borderColor | string | | Define the color of the box |
| borderWidth | string |  | Define the width of the border |
| endValue | number |  | Define a end value of the line, drawing a diagonal line |

#### chartLabelAnnotation

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| text | string| | Text of the label in the tooltip |
| position | string | | 'center', 'left' or 'right'|
| backgroundColor | string |  | Define the color of the background |
| fontStyle | string |  | Define the styles of the text |
| fontColor | string |  | Define the color of the label |


#### ChartLine
Draw a simple line

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| xMinValue | any | 0 | Min value of the axis X |
| yMinValue | any | 0 | Min value of the axis Y |
| xMaxValue | any | 0 | Max value of the axis X |
| yMaxValue | any | 0 | Max value of the axis Y |
| borderColor | string | black | Define the color of the line |
| borderWidth | string |  | Define the width of the line |

### Tooltips

You can configure the content of the tooltips and the style.

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| backgroundColor | string|'rgba(0,0,0,0.8)' | Tooltip background color|
| titleFontSize | number |12 | Title font size |
| titleFontColor | string | '#ffffff' | Title font color |
| bodyFontColor | string | '#ffffff' | Tooltip body font color |
| bodyFontSize | number | 12 | Tooltip body font size |
| borderColor | string | 'rgba(0,0,0,0)' | Tooltip border color |
| borderWidth | number | 0 | Tooltip border width |

#### ChartTooltipItem

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| title | string| | The content for the title|
| label | number | | The content for the body |
| afterLabel | string | | The content that you can set after the label |
| valueInAfterLabel | boolean | true | you can decide where display the value, next the label (valueInAfterLabel set to false) or after the label (valueInAfterLabel set to true)|

```javascript
this.dataLine.push(new ChartItem('Only Line', [13, 20, 21, 15], '', '', false, true, false, 3, '',
	new ChartTooltipItem('title', 'label', 'afterlabel', true)));
```

#### Tooltips for the Bubble charts

There is the option to display the label that you want instead of the coordinates (by default defined). Set the variable **t** in the data parameter and the system will consider it as the tooltip label.

```javascript
[{x: 13, y: 13, r: 4, t: 'Tooltip label'}, {x: 1, y: 2, r: 3}]
```

### Chart labels

You can configure labels to show the value of the chart's datasets (e.g. the percentage of the value over the total) To do so, there is an input attribute named "chartLabelSettings"
whose needs to receive a ChartLabelSettings object.

#### ChartLabelSettings

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| position | ChartLabelPosition| | The settings for positioning every label|
| labelColors | ChartLabelColor| | The settings for the color of *all* the labels|
| chartLabelFont | ChartLabelFont| | The parameters for the labels' font (font family, size, style, etc)|
| chartLabelPadding | ChartLabelPadding| | The padding for every label|
| chartLabelText | ChartLabelText| | The parameters for the labels' text (text align, stroke, shadow)|
| formatter | (value: any, context: any) => string| | A function that given a value and chart context returns the value as a formatted string

Example of use: let's assume that we have the following code in a component

```javascript
        this.pieChartLabelSettings = new ChartLabelSettings();
this.pieChartLabelSettings.position = new ChartLabelPosition();
this.pieChartLabelSettings.position.clip = false; // to avoid showing part of the label, set clip = true

this.pieChartLabelSettings.position.display = 'auto';
this.pieChartLabelSettings.labelColors = new ChartLabelColor(undefined, 'black', undefined, 5, 1, 0.8);
const fontFamily = 'Courier, Arial Unicode MS, Arial, sans-serif';
this.pieChartLabelSettings.chartLabelFont = new ChartLabelFont(undefined, fontFamily, 16, undefined, 'bold', 0.8);
this.pieChartLabelSettings.chartLabelPadding = new ChartLabelPadding(undefined, 1, 1, 1, 1);

const myPieLabelFormatter = (value: any, context: any
):
string => {
	let dataArr: Array<number> = (context.chart.data.datasets[0].data
	as
	Array < number >
)
	;
	return (value * 100 / arraySum(dataArr)).toFixed(0) + '%';
}

this.pieChartLabelSettings.formatter = myPieLabelFormatter;
```

Then we can use systelab-chart with the "chartLabelSettings" attribute among others:

            <systelab-chart [labels]="labels" [data]="dataPie" [showLegend]="legend" [(itemSelected)]="itemSelected" [type]="'pie'" (action)="doAction($event)"
                            [isBackgroundGrid]="isBackgroundGrid" [chartLabelSettings]="pieChartLabelSettings"></systelab-chart>

The auxiliary classes (ChartLabelPosition, ChartLabelColor, etc) constructors are defined as follows:

##### ChartLabelPosition

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| align | string or number| 'center'| The align option defines the position of the label relative to the anchor point position and orientation. Its value can be expressed either by a number representing the clockwise angle (in degree) or by one of the following string presets:|
| | | | 'center' (default): the label is centered on the anchor point |
| | | | 'start': the label is positioned before the anchor point, following the same direction |
| | | | 'end': the label is positioned after the anchor point, following the same direction |
| | | | 'right': the label is positioned to the right of the anchor point (0°) |
| | | | 'bottom': the label is positioned to the bottom of the anchor point (90°) |
| | | | 'left': the label is positioned to the left of the anchor point (180°) |
| | | | 'top':  the label is positioned to the top of the anchor point (270°) |
| | | | a number:  the label is positioned to the specified number of grades relative to the anchor. E.g. 90 is equivalent to 'bottom', 45 in the "middle" between 'bottom' and 'right' |
| anchor |string| 'center' | An anchor point is defined by an orientation vector and a position on the data element. The orientation depends on the scale type (vertical, horizontal or radial). The position is calculated based on the anchor option and the orientation vector. |
| | | | 'center' (default):  label's anchor is centered on the element's boundary that the label represents|
| | | | 'start' :  label's anchor is positioned in the lowest boundary of the element that the label represents|
| | | | 'end' :  label's anchor is positioned in the highest boundary of the element that the label represents|
| clamp | boolean| false| The clamp option, when true, enforces the anchor position to be calculated based on the visible geometry of the associated element (i.e. part inside the chart area)|
| clip | boolean| false| When the clip option is true, the part of the label which is outside the chart area will be masked|
| display | ((context: any) => (boolean or string)) or boolean| true | The display option controls the visibility of labels and accepts the following values:|
| | | | true (default): the label is drawn |
| | | | false : the label is hidden |
| | | | 'auto' : the label is hidden if it overlap with another label |
| | | | This option is scriptable, so it's possible to show/hide specific labels: see example below |
| offset | number| 4| The offset represents the distance (in pixels) to pull the label away from the anchor point. This option is not applicable when align is 'center'. Also note that if align is 'start', the label is moved in the opposite direction.|
| rotation | number| 0| This option controls the clockwise rotation angle (in degrees) of the label, the rotation center point being the label center.|

Example of specifiying the "display" property as a function:

```javascript
const displayFunction = (context: any)
:
boolean => {

	let dataArr: Array<number> = (context.chart.data.datasets[0].data
	as
	Array < number >
)
	;

	const currentPercentage = context.dataset.data[context.dataIndex] * 100 / arraySum(dataArr);

	return currentPercentage >= 5;
}
this.pieChartLabelSettings.position.display = displayFunction;
```

##### ChartLabelColor

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| backgroundColor | string | null| The background color for every label. It accepts names, hexadecimal values and rgb definitions. E.g.: 'white', '#778899', 'rgb(0,255,0)'. If not defined, the background does not take any color|
| color | string | '#666'| The color for the text in every label. It accepts names, hexadecimal values and rgb definitions, too.|
| borderColor | string | null| The color for every label's border. Again, it accepts names, hexadecimal values and rgb definitions. If not defined, the border is not visible|
| borderRadius | number | 0| The radius of every label's border. A value bigger than zero makes the label's border corner being rounded.|
| borderWidth | number | 0| The width of the label's borders. If it's value is undefined or zero, the border is not shown.|
| opacity | number | 1| Defines the opacity of the label's text. Values go from 0 to 1, including decimals (for example 0.5) A value of zero makes the text invisible|

##### ChartLabelFont

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| font | object | null| An object that can be used as a shorthand to specify the family, size, style, weight and lineHeight parameters, see object's definition below. Usually, if this parameter is defined the rest of the parameters, family, size, etc are set as undefined. But if they don't, their values will substituted the ones defined in "font" |
| family | string | "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"| Font family for the text of all the labels|
| size | number | 12| Labels' font size|
| style | string | 'normal'| Labels' font style. The possible values are 'italic', 'oblique' and 'normal'|
| weight | string or number | 'normal'| Labels' font weight. The possible values are 'bold', 'bolder', 'lighter', 'normal' and a number (e.g. 100, 200, etc|
| lineHeight | string or number | 1.2| Defines the space between each line in the labels' text (if the need more than one line)|

Definition of the font parameter as an object:

```javascript
type
Font = {
	family    ? : string,
	lineHeight? : string | number,
	size      ? : number,
	style     ? : 'normal' | 'italic' | 'oblique',
	weight    ? : 'normal' | 'bold' | 'bolder' | 'lighter' | number
};
```

##### ChartLabelPadding

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| padding | number or object | undefined| If used as a number, it specifies the padding for the top, right, bottom and left padding of the labels' text. If used as an object, it has to defined as a shorthand of the 4 properties, see the definition of the object below|
| top | number | 4| The top padding for the labels' text|
| right | number | 4| The right padding for the labels' text|
| bottom | number | 4| The bottom padding for the labels' text|
| left | number | 4| The left padding for the labels' text|

Definition of the padding parameter as an object:

```javascript
type
Padding = number | {
	top   ? : number,
	right ? : number,
	bottom? : number,
	left  ? : number
};
```

##### ChartLabelText

| Name | Type | Default | Description |
| ---- |:----:|:-------:| ----------- |
| textAlign | string | 'start'| The textAlign option only applies to multiline labels and specifies the text alignment being used when drawing the label text|
| | | | Supported values are: |
| | | | 'start' (default): the text is left-aligned |
| | | | 'center': the text is centered |
| | | | 'end': the text is right-aligned |
| | | | 'left': alias of 'start' |
| | | | 'right': alias of 'end' |
| textStrokeColor | string | null | Color for the labels' text stroke|
| textStrokeWidth | number | null | Width of the labels' text stroke|
| textShadowBlur | number | null | Blur of the labels' text stroke|
| textShadowColor | string | null | Color for the labels' text shadow|

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

## Functions

| Name | Parameters | Description |
| ---- |:----------:| ------------|
| getResizedBase64Image | number?, number? | Get the base64 png string image scaled based on the height and width parameters (if provided).|
| doResizeChart | string, string | Perform a chart resize based on the height and width parameters (in pixels).|

**Note**: _responsive_ and _maintainAspectRatio_ parameters must be set to _**false**_.
