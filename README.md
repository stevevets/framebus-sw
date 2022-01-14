# Framebus-sw

`Framebus-sw`, a forked project from `Framebus 5.1.2`, allows you to easily send messages across frames (and iframes) with with either broadcasting to all or only to the especified frame.

Usage references: `Framebus` (https://github.com/braintree/framebus)

## Change

### Added `broadcastMode` to `FramebusOptions`.

Option `broadcastMode` decided which window the message will be post to. Options such `self`, `parent`, `children` will verify window origin with target origin before post message, so that can avoid the error throw from `postMessage` when it does not.

```js
type FramebusOptions = {
  origin?: string, // default: "*"
  broadcastMode?: string, // default "all
  channel?: string, // no default
  verifyDomain?: (url: string) => boolean, // no default
};
```

If `Verify Origin` is `No`, it will throw error to web console when window origin does not match with target origin.

| Options    | Verify Origin | Description                                                             |
| ---------- | ------------- | ----------------------------------------------------------------------- |
| `all`      | No            | Broadcast the message to all iframes from the top to down.              |
| `self`     | Yes           | Only post the message back to window itself                             |
| `parent`   | Yes           | Only post the message to the `window.parent`.                           |
| `top`      | No            | Only post the message to `window.top`.                                  |
| `children` | Yes           | Post to all accessible iframe in the window excluded the window itself. |

### Examples

```js
    const Framebus = require('framebus-sw');

    // default bus instance
    const bus = new Framebus();
    const defaultBus = new Framebus({ broadcastMode: 'all' });

    // bus instance only posts messages to itself
    const selfBus = new Framebus({
        origin: location.origin,
        broadcastMode: 'self'
    });

    // bus instance only posts messages to its verified parent
    const parentBus = new Framebus({
        origin: 'http://parent_origin.com'
        broadcastMode: 'parent'
    });

    // bus instance only posts messages to the verified children
    const childrenBus = new Framebus({
        origin: 'http://children_1.com'
        broadcastMode: 'children'
    });
```
