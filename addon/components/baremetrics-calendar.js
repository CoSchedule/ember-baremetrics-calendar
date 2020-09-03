import Component from '@glimmer/component';
import { action } from '@ember/object';
import JQuery from 'jquery';
import { equal } from '@ember/object/computed';
import { run } from '@ember/runloop';
import Calendar from 'BaremetricsCalendar';

/**
 * @module
 * @extends Component
 *
 * @typedef {Object} Args
 * @type {Date} [currentDate]
 * @type {Date} [startDate]
 * @type {Date} [endDate]
 * @type {Date} [earliestDate]
 * @type {Date} [latestDate]
 * @type {String} [inputFormat]
 * @type {String} [jumpMonthFormat]
 * @type {String} [jumpYearFormat]
 * @type {String} [presetFormat]
 * @type {String[]} [dayLabels]
 * @type {Object[]} [presets]
 * @type {Boolean} [required]
 * @type {String} [placeholder]
 * @type {Boolean} [sameDayRange]
 *
 * @extends Component<Args>
 */
export default class BaremetricsCalendarComponent extends Component {
  // -------------------------------------------------------------------------
  // Events

  /**
   * When used as a single date picker, `currentDate` should be the value of the
   * currently selected date.
   *
   * @type {Date}
   */
  get currentDate() {
    return this.args.currentDate || null;
  }

  /**
   * When used as a double date picker (i.e. date ranges), `startDate` should be
   * the value of the currently selected start date.
   *
   * Note: this value is purposely set to `undefined` as a default. See the
   * `type` property for why.
   *
   * @type {Date}
   */
    get startDate() {
      return this.args.startDate || undefined;
    }

  /**
   * When used as a double date picker (i.e. date ranges), `endDate` should be
   * the value of the currently selected start date.
   *
   * @type {Date}
   */
  get endDate() {
    return this.args.endDate || null;
  }

  /**
   * When used as a double date picker (i.e. date ranges), `earliestDate`
   * is the earliest date that the UI will allow the user to select.
   *
   * @type {Date}
   */
  get earliestDate() {
    return this.args.earliestDate || null;
  }

  /**
   * When used as a double date picker (i.e. date ranges), `latestDate`
   * is the latest date that the UI will allow the user to select.
   *
   * @type {Date}
   */
  get latestDate() {
    return this.args.latestDate || null;
  }

  /**
   * A moment.js format string for how dates should appear in the inputs.
   *
   * @type {String}
   */
  get inputFormat() {
    return this.args.inputFormat || 'MMMM D, YYYY';
  }

  /**
   * A moment.js format string for how month labels should appear when switching
   * months.
   *
   * @type {String}
   */
  get jumpMonthFormat() {
    return this.args.jumpMonthFormat || 'MMMM';
  }

  /**
   * A moment.js format string for how year labels should appear when switching
   * years.
   *
   * @type {String}
   */
  get jumpYearFormat() {
    return this.args.jumpYearFormat || 'YYYY';
  }

  /**
   * A moment.js format string for how preset labels should appear in the preset
   * menu. Only applicable in double mode (see `.type).
   *
   * @type {String}
   */
  get presetFormat() {
    return this.args.presetFormat || null;
  }

  /**
   * An array of strings for the day of week labels, starting with Sunday.
   *
   * @type {String[]}
   */
  get dayLabels() {
    return this.args.dayLabels || [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];
  }

  /**
   * An array of preset objects to display. If not supplied, it will default to a basic
   * set of built-in presets.
   *
   * Preset objects should look like:
   *
   *     {
   *       label: 'Last month',
   *       start: moment().subtract(1, 'month').startOf('month'),
   *       end: moment().subtract(1, 'month').endOf('month')
   *     }
   *
   * @type {Object[]}
   */
  get presets() {
    return this.args.presets || false;
  }

  /**
   * When using in single date mode (see `.type`), use this flag to indicate
   * that the input field must always have a valid selected date.
   *
   * @type {Boolean}
   */
  get required() {
    return this.args.required || false;
  }

  /**
   * Placeholder string that appears in single date mode (see `.type`), and only
   * if `required` is set to false. Defaults to the `inputFormat` string.
   *
   * @type {String}
   */
  get placeholder() {
    return this.args.placeholder || null;
  }

  /**
   * In double mode (see `.type`), is a single day a valid range selection?
   *
   * @type {Boolean}
   */
  get sameDayRange() {
    return this.args.sameDayRange || true;
  }

  /**
   * What kind of date picker is this:
   *
   *  * `'single'`: picks a single date
   *  * `'double'`: picks a date range (i.e. a start and end date)
   *
   * If you don't supply a value, it will attempt to automatically detect by
   * checking to see if you supplied any value (including `null`) for
   * `startDate`. If so, it will be treated as `'double'`.
   *
   * @type {String}
   */
  get type() {
    if (typeof this.startDate !== 'undefined') {
      return 'double';
    }
    return 'single';
  }

  /**
   * Convenience computed property for the `type === 'single'`
   *
   * @type {Boolean}
   */
  @equal('type', 'single') isSingle;

  /**
   * Convenience computed property for the `type === 'double'`
   *
   * @type {Boolean}
   */
  @equal('type', 'double') isDouble;

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Builds the config object that the Calendar constructor expects
   *
   * @method setupCalendar
   * @private
   * @return {Object}
   */
  @action
  setupCalendar(element) {
    let component = this; // we need context from the 3rd party as well as the component
    const config = {
      element: JQuery(element),
      format: {
        input: this.inputFormat,
        jump_month: this.jumpMonthFormat,
        jump_year: this.jumpYearFormat
      },
      days_array: this.dayLabels,
      presets: this.presets,
      placeholder: this.placeholder,
      callback() {
        component._parseCallback(this)
      },
    };

    if (this.type === 'single') {
      config.current_date = this.currentDate;
      config.required = this.required;
      element.classList.add('daterange--single');
    } else {
      config.earliest_date = this.earliestDate;
      config.latest_date = this.latestDate;
      config.start_date = this.startDate;
      config.end_date = this.endDate;
      config.format.preset = this.presetFormat;
      config.same_day_range = this.sameDayRange;
      element.classList.add('daterange--double');
    }
    return new Calendar(config);
  }

  /**
   * Invoked by the Calendar library when a date value changes. Responsible for
   * parsing the values and invoking the supplied `onchange` action with the
   * relevant change data.
   *
   * @method _parseCallback
   * @param calendar {Calendar} the calendar instance
   * @private
   */
  _parseCallback({ current_date, start_date, end_date }) {
    run(() => {
      let result = start_date ? { startDate: start_date, endDate: end_date } : current_date;
      this.args.onchange?.(result)
    });
  }
}
