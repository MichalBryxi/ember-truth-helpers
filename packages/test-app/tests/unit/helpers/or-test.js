import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('helper:or', function (hooks) {
  setupRenderingTest(hooks);

  test('simple test 1', async function (assert) {
    await render(hbs`[{{or true 1 ' ' null undefined}}]`);

    assert.equal(
      this.element.textContent,
      '[true]',
      'value should be "[true]"'
    );
  });

  test('simple test 2', async function (assert) {
    await render(hbs`[{{or null undefined true 1 ' '}}]`);

    assert.equal(
      this.element.textContent,
      '[true]',
      'value should be "[true]"'
    );
  });

  test('simple test 3', async function (assert) {
    await render(
      hbs`[{{or false}}] [{{or true}}] [{{or 1}}] [{{or ''}}] [{{or false ''}}] [{{or true ''}}] [{{or '' true}}]`
    );

    assert.equal(
      this.element.textContent,
      '[false] [true] [1] [] [] [true] [true]',
      'value should be "[false] [true] [1] [] [] [true] [true]"'
    );
  });

  test('simple test 4', async function (assert) {
    const fakeContextObject = EmberObject.create({
      valueA: null,
      valueB: null,
    });

    this.set('contextChild', fakeContextObject);

    await render(
      hbs`[{{or this.contextChild.valueA}}] [{{or this.contextChild.valueB}}] [{{or this.contextChild.valueB this.contextChild.valueA}}] [{{or this.contextChild.valueA this.contextChild.valueB}}]`
    );

    assert.equal(
      this.element.textContent,
      '[] [] [] []',
      'value should be "[] [] [] []"'
    );

    run(fakeContextObject, 'set', 'valueA', undefined);
    assert.equal(
      this.element.textContent,
      '[] [] [] []',
      'value should be "[] [] [] []"'
    );

    run(fakeContextObject, 'set', 'valueA', '');
    assert.equal(
      this.element.textContent,
      '[] [] [] []',
      'value should be "[] [] [] []"'
    );

    run(fakeContextObject, 'set', 'valueA', ' ');
    assert.equal(
      this.element.textContent,
      '[ ] [] [ ] [ ]',
      'value should be "[ ] [] [ ] [ ]"'
    );

    run(fakeContextObject, 'set', 'valueB', 'yellow');
    assert.equal(
      this.element.textContent,
      '[ ] [yellow] [yellow] [ ]',
      'value should be "[ ] [yellow] [yellow] [ ]"'
    );
  });

  test('it does short-circuit with truthy argument', async function (assert) {
    this.foo = {
      get bar() {
        assert.step('get bar');
        return true;
      },
      get baz() {
        assert.step('get baz');
        return false;
      },
    };

    await render(hbs`[{{or this.foo.bar this.foo.baz}}]`);

    assert.verifySteps(['get bar']);
    assert.dom().hasText('[true]');
  });
});
