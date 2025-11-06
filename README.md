# addConfirm() Utility

## Overview

`addConfirm()` is a lightweight JavaScript utility that attaches confirmation dialogs to elements before executing their original actions.  
It supports both click and change events and works seamlessly with custom dialogs or the built-in `window.confirm()`.

The utility is designed as a singleton: it only needs to be initialized once, and automatically handles all matching elements on the page.

---

## Features

- Works for any selector (default: `.need-confirm`)
- Supports multiple event types (default: `click` and `change`)
- Uses `data-master` to determine which event triggers confirmation
- Customizable confirmation dialog (`confirmFn`)
- Dispatches custom `nochange` events for denied changes
- Prevents event loops by using a WeakMap to track bypassed confirmations
- Safe default fallback to `window.confirm()` if no dialog library is provided

---

## Installation

Simply include the script in your project and initialize it once after your DOM is ready.

```html
<script type="module">
import { addConfirm } from './addConfirm.js';

addConfirm({
  selector: '.need-confirm',
  events: ['click', 'change']
});
</script>
```

---

## Usage Examples

### Basic Example (click confirmation)

```html
<button class="need-confirm" data-ask="Are you sure you want to delete?">
  Delete
</button>
```

When clicked, a confirmation dialog appears.  
If the user accepts, the button's original click event executes normally.  
If the user cancels, the event is stopped.

---

### Example with input fields

```html
<input
  type="text"
  class="need-confirm"
  data-master="change"
  data-ask="Save new value?"
  value="Initial text"
  onchange="alert('Value changed!')">
```

When the user changes the input value, `addConfirm` intercepts the change event.  
If the user confirms, the `change` event continues as normal.  
If the user cancels, the input emits a custom `nochange` event instead.

You can listen for that event:

```js
document.querySelector('input').addEventListener('nochange', e => {
  console.log('Change was canceled. Value:', e.detail.value);
});
```

---

## The data-master Attribute

`data-master` allows fine-grained control over when the confirmation dialog should appear.

By default, `addConfirm()` listens to both `click` and `change` events, but only the one matching the element’s `data-master` value will trigger confirmation.

If no `data-master` is defined, `click` is assumed as the default.

### Examples

```html
<!-- Confirm on click (default) -->
<button class="need-confirm" data-ask="Delete entry?">Delete</button>

<!-- Confirm when value changes -->
<input
  type="text"
  class="need-confirm"
  data-master="change"
  data-ask="Save changes?"
  value="Hello">
```

This ensures that confirmation dialogs appear only when appropriate for each element type.

---

## Custom Confirmation Dialogs

You can use your own modal or dialog implementation instead of `window.confirm()`.

```js
import { addConfirm } from './addConfirm.js';
import dialogs from './dialogs.js'; // your custom dialog module

addConfirm({
  confirmFn: dialogs.myConfirm,
  closeFn: dialogs.closeDiag
});
```

If no custom dialog is provided, `addConfirm` falls back to:

```js
confirmFn: dialogs?.myConfirm ?? ((msg, yes, no) => { if (window.confirm(msg)) yes(); else no(); }),
closeFn: dialogs?.closeDiag ?? (() => {})
```

---

## Events Overview

| Event | Triggered By | Description |
|--------|--------------|--------------|
| `click` | Default | Triggers confirmation for clickable elements |
| `change` | `data-master="change"` | Triggers confirmation when input value changes |
| `nochange` | On cancel | Fired when the user rejects a change confirmation |

---

## Notes on Performance

`addConfirm()` attaches only a few global event listeners (one per event type).  
Because it uses event delegation (`document.body.addEventListener`), it efficiently handles large documents without per-element listeners.

The WeakMap ensures that memory leaks are avoided even when elements are dynamically added or removed from the DOM.

---

## License

This utility is free to use and modify. Attribution is appreciated but not required.
