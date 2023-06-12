# systelab-meter

Component to show a Meter widget

## Using the component

There are three types of meters:

- Digital Meter
- Radial Meter
- Linear Meter (horizontal / vertical)

```html

<systelab-digital-meter [value]="11"
                        [borderColor]="'#027bff'"
                        [numberFormat]="'#.####'"></systelab-digital-meter>
```

```html

<systelab-radial-meter [value]="10"
                       [min]="0"
                       [max]="20"
                       [levels]="levels"
                       [borderColor]="'#027bff'"
                       [numberFormat]="'#.####'">
```

```html

<systelab-linear-meter [isHorizontal]="true"
                       [value]="-10"
                       [min]="0"
                       [max]="20"
                       [borderColor]="'#027bff'"
                       [numberFormat]="'#.####'"
                       [levels]="levels"></systelab-linear-meter>
```



## Properties

| Name          |  Type   | Default | Description                                                                            |
|---------------|:-------:|:-------:|----------------------------------------------------------------------------------------|
| isHorizontal  | boolean |  false  | Set to true, if you want that display a bar chart in horizontal view (only for linear) |
| value         | number  |         | Current Value                                                                          |
| min           | number  |         | Value as a lower limit.                                                                |
| max           | number  |         | Value as a higher limit.                                                               |
| levels        | object  |         | List of levels                                                                         |
| numberFormat  | string  |         | Number format                                                                          |
| borderColor   | string  |         | Color for the border                                                                   |

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
