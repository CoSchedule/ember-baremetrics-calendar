import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, find, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import moment from 'moment';
import $ from 'jquery';

function format(date, pattern = 'MMMM D, YYYY') {
  return moment(date).format(pattern);
}

function nextDayAfter(selector) {
  const current = find(selector);
  let sibling = current.nextElementSibling;
  while (sibling && !sibling.classList.contains('dr-day')) {
    sibling = sibling.nextElementSibling;
  }
  return sibling;
}

module('Integration | Component | baremetrics-calendar', function (hooks) {
  setupRenderingTest(hooks);

  test('it uses the jQuery instance served by loader.js', function (assert) {
    assert.strictEqual($, window.jQuery);
  });

  test('it renders a single date picker', async function (assert) {
    this.currentDate = moment('2021-03-10', 'YYYY-MM-DD').toDate();

    await render(
      hbs`<BaremetricsCalendar @currentDate={{this.currentDate}} class="extra" />`,
    );

    assert
      .dom('.baremetrics-calendar')
      .hasClass('daterange')
      .hasClass('daterange--single')
      .hasClass('extra');
    assert.dom('.dr-input').hasText(format(this.currentDate));
  });

  test('it renders a date range with presets', async function (assert) {
    this.startDate = moment('2021-03-01', 'YYYY-MM-DD').toDate();
    this.endDate = moment('2021-03-10', 'YYYY-MM-DD').toDate();
    this.presets = [
      {
        label: 'First week of March',
        start: moment('2021-03-01', 'YYYY-MM-DD'),
        end: moment('2021-03-07', 'YYYY-MM-DD'),
      },
    ];

    await render(hbs`<BaremetricsCalendar
  @startDate={{this.startDate}}
  @endDate={{this.endDate}}
  @presets={{this.presets}}
/>`);

    assert.dom('.baremetrics-calendar').hasClass('daterange--double');
    assert
      .dom('.dr-input')
      .hasText(`${format(this.startDate)}–${format(this.endDate)}`);
    assert.dom('.dr-presets').exists();
    assert.dom('.dr-list-item').includesText('First week of March');
  });

  test('it uses a custom input format', async function (assert) {
    this.currentDate = moment('2021-03-10', 'YYYY-MM-DD').toDate();

    await render(
      hbs`<BaremetricsCalendar @currentDate={{this.currentDate}} @inputFormat="YYYY/MM/DD" />`,
    );

    assert.dom('.dr-input').hasText('2021/03/10');
  });

  test('it calls @onchange with the picked date', async function (assert) {
    const currentDate = moment('2021-03-10', 'YYYY-MM-DD');
    this.currentDate = currentDate.toDate();
    this.changed = (newDate) => {
      assert.step('changed');
      assert.true(moment.isMoment(newDate), 'onchange receives a moment');
      assert.strictEqual(
        format(newDate),
        format(currentDate.clone().add(1, 'day')),
      );
    };

    await render(
      hbs`<BaremetricsCalendar @currentDate={{this.currentDate}} @onchange={{this.changed}} />`,
    );

    await click('.dr-date');
    await triggerEvent(nextDayAfter('.dr-current'), 'mousedown');

    assert.verifySteps(['changed']);
    assert.dom('.dr-input').hasText(format(currentDate.clone().add(1, 'day')));
  });

  test('it calls @onchange with the picked range', async function (assert) {
    const startDate = moment('2021-03-01', 'YYYY-MM-DD');
    const endDate = moment('2021-03-10', 'YYYY-MM-DD');
    this.startDate = startDate.toDate();
    this.endDate = endDate.toDate();
    this.changed = (result) => {
      assert.step('changed');
      assert.true(moment.isMoment(result.startDate));
      assert.true(moment.isMoment(result.endDate));
      assert.strictEqual(format(result.startDate), format(startDate));
      assert.strictEqual(
        format(result.endDate),
        format(endDate.clone().add(1, 'day')),
      );
    };

    await render(hbs`<BaremetricsCalendar
  @startDate={{this.startDate}}
  @endDate={{this.endDate}}
  @onchange={{this.changed}}
/>`);

    await click('.dr-date-end');
    await triggerEvent(nextDayAfter('.dr-end.dr-current'), 'mousedown');

    assert.verifySteps(['changed']);
    assert
      .dom('.dr-input')
      .hasText(`${format(startDate)}–${format(endDate.clone().add(1, 'day'))}`);
  });
});
