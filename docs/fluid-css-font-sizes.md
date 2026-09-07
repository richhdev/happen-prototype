# Fluid Typography — How the `clamp()` Calculation Works

Fluid typography allows a value, such as a font size, to scale smoothly between two viewport sizes.

For example:

- At **390px viewport width** → font size is **40px**
- At **1200px viewport width** → font size is **70px**

The goal is to generate:

```css
clamp(40px, calc(25.56px + 3.704vw), 70px)
```

## 1. Find the change in font size

First, calculate how much the font size needs to grow:

```text
maxValue - minValue

70 - 40 = 30px
```

The font needs to grow by **30px**.

## 2. Find the change in viewport width

Next, calculate the viewport range:

```text
maxViewport - minViewport

1200 - 390 = 810px
```

The viewport grows by **810px**.

## 3. Calculate the slope

Divide the change in font size by the change in viewport width:

```text
slope = (maxValue - minValue) / (maxViewport - minViewport)

slope = 30 / 810

slope = 0.037037
```

This means:

> For every 1px the viewport grows, the font grows by approximately 0.037px.

This is the **slope** of the line.

Mathematically, this is the familiar:

```text
y = mx + b
```

Where:

- `y` = font size
- `x` = viewport width
- `m` = slope
- `b` = intercept

## 4. Convert the slope to `vw`

CSS `vw` represents **1% of the viewport width**.

The slope is:

```text
0.037037
```

To express this as `vw`, multiply it by 100:

```text
0.037037 × 100 = 3.7037
```

So the slope becomes:

```css
3.704vw
```

This gives us the fluid growth component:

```css
3.704vw
```

However, this alone doesn't produce our desired values.

At a 390px viewport:

```text
390 × 0.03704 ≈ 14.44px
```

But we need the font to be **40px** at 390px.

So we need an additional offset.

## 5. Calculate the intercept

The intercept is the amount we need to add to the `vw` value to reach our minimum value.

```text
minValue - (slope × minViewport)

40 - (0.037037 × 390)

40 - 14.44

= 25.56px
```

So our complete fluid calculation becomes:

```css
calc(25.56px + 3.704vw)
```

At 390px:

```text
25.56 + (390 × 0.03704)
≈ 40px
```

At 1200px:

```text
25.56 + (1200 × 0.03704)
≈ 70px
```

## 6. Add `clamp()`

Finally, we wrap the calculation in `clamp()`:

```css
clamp(40px, calc(25.56px + 3.704vw), 70px)
```

`clamp()` takes three values:

```text
clamp(minimum, preferred, maximum)
```

So in our example:

```text
              minimum                 fluid calculation             maximum
                 ↓                            ↓                        ↓
clamp(          40px,          calc(25.56px + 3.704vw),              70px)
```

This means:

- The font will **never be smaller than 40px**
- It will scale fluidly using the `calc()` expression
- It will **never be larger than 70px**

## The Mental Model

The calculation is essentially finding the straight line between two points:

```text
(390, 40)
(1200, 70)
```

Where:

```text
viewport width → font size
```

The browser then follows that line as the viewport changes.

You can think of the formula as:

```text
font size = starting offset + viewport-based growth
```

Or mathematically:

```text
y = mx + b
```

Where:

- `y` = font size
- `x` = viewport width
- `m` = slope → converted to `vw`
- `b` = intercept → expressed in `px`

## The General Formula

Given:

```text
minViewport
maxViewport

minValue
maxValue
```

Calculate the slope:

```text
slope = (maxValue - minValue) / (maxViewport - minViewport)
```

Calculate the intercept:

```text
intercept = minValue - (slope × minViewport)
```

Convert the slope to `vw`:

```text
vw = slope × 100
```

Then the final CSS is:

```css
clamp(
  minValue,
  calc(intercept + vw),
  maxValue
)
```

For example:

```text
Viewport: 390 → 1200
Value:     40 → 70
```

Produces:

```css
clamp(40px, calc(25.56px + 3.704vw), 70px)
```

This approach lets us define typography using simple **minimum and maximum design tokens**, while automatically generating the fluid CSS between them.
