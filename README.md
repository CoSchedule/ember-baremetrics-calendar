# ember-baremetrics-calendar

A wrapper for [the awesome date range picker from Baremetrics](https://github.com/Baremetrics/calendar).

Compatibility
------------------------------------------------------------------------------

- Ember.js v3.28 through v7.x (classic `ember-cli-build.js` builds)
- Ember CLI v3.28 or above
- ember-auto-import v2 with webpack 5 in the consuming app
- `moment` 2.x installed in the consuming app
- a `jquery` module provided by the consuming app through loader.js, e.g.
  `app.import('node_modules/jquery/dist/jquery.js')` plus a vendor shim that
  runs `define('jquery', [], () => ({ default: self.jQuery, __esModule: true }))`
  (see `ember-cli-build.js` and `vendor/dummy/jquery-shim.js` here). The addon
  does not depend on jQuery and excludes it from ember-auto-import, so it
  shares the app's single instance
- Node.js v20.19 or above

Installation
------------------------------------------------------------------------------

## Installation

```sh
$ npm install @coschedule/ember-baremetrics-calendar
```

## Usage

The component exposes the main options of the underlying plugin as camelCased
arguments: `@currentDate`, `@startDate`, `@endDate`, `@earliestDate`,
`@latestDate`, `@inputFormat`, `@jumpMonthFormat`, `@jumpYearFormat`,
`@presetFormat`, `@dayLabels`, `@presets`, `@required`, `@placeholder` and
`@sameDayRange`. See the
[Baremetrics Calendar docs](https://github.com/Baremetrics/calendar#base-calendar-params)
for what each one does.

The calendar component supports two modes: single date entry, and date range
("double") entry.

### Single Dates

If you pass `@currentDate` without `@startDate`, the component uses the single
date entry mode:

```hbs
<BaremetricsCalendar @currentDate={{this.date}} @onchange={{this.updateDate}} />
```

When the user selects a different date, `@onchange` is called with the new date
(a moment object).

### Date Ranges

If you pass `@startDate` (and `@endDate`), the component uses the date range
entry mode:

```hbs
<BaremetricsCalendar
  @startDate={{this.startDate}}
  @endDate={{this.endDate}}
  @onchange={{this.updateRange}}
/>
```

When the user selects a different start or end date, `@onchange` is called with
`{ startDate, endDate }` (moment objects).

## Styling

This addon will automatically import the styles that ship with the underlying
plugin - nothing additional work required.

If you want to customize the look and feel, you can override the included styles
with your own CSS rules with greater specificity.

Or, if you'd rather style the component from scratch, you add the following to
your `ember-cli-build.js` file:

```js
// ember-cli-build.js

var app = new EmberApp(defaults, {
  baremetricsCalendar: {
    includeStyles: false,
  },
});
```

## Running Tests

- `npm test` (lint and tests)
- `npm run test:ember-compatibility` (runs every `ember try` scenario)
- `ember test --server`

## Building

- `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
