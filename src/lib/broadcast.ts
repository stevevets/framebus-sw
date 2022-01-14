import { hasOpener } from "./has-opener";

export function broadcast(
  frame: Window,
  payload: string,
  origin: string,
  broadcastMode = "all"
): void {
  try {
    if (broadcastMode === "self") {
      broadcastToSelf(payload, origin);
    } else if (broadcastMode === "parent") {
      broadcastToParent(payload, origin);
    } else if (broadcastMode === "top") {
      broadcastToTop(payload, origin);
    } else if (broadcastMode === "children") {
      broadcastToChildren(payload, origin);
    } else if (broadcastMode === "all") {
      broadcastToAll(frame, payload, origin, broadcastMode);
    }
  } catch (_) {
    /* ignored */
  }
}

const broadcastToAll = (
  frame: Window,
  payload: string,
  origin: string,
  broadcastMode: string
) => {
  try {
    let i = 0;
    let frameToBroadcastTo;

    frame.postMessage(payload, origin);

    if (hasOpener(frame) && frame.opener && frame.opener.top !== window.top) {
      broadcast(frame.opener.top, payload, origin, broadcastMode);
    }

    // previously, our max value was frame.frames.length
    // but frames.length inherits from window.length
    // which can be overwritten if a developer does
    // `var length = value;` outside of a function
    // scope, it'll prevent us from looping through
    // all the frames. With this, we loop through
    // until there are no longer any frames
    // eslint-disable-next-line no-cond-assign
    while ((frameToBroadcastTo = frame.frames[i])) {
      broadcast(frameToBroadcastTo, payload, origin, broadcastMode);
      i++;
    }
  } catch (_) {
    /* ignored */
  }
};

const broadcastToSelf = (payload: string, origin: string) => {
  if (origin === "*" || origin === location.origin) {
    window.self.postMessage(payload, origin);
  }
};

const broadcastToParent = (payload: string, origin: string) => {
  if (window.parent && window.self !== window.parent) {
    // firefox does not support ancestorOrigins
    // referrer could be affected by the referrer policy
    const parentURL = window.self.document.location.ancestorOrigins
      ? document.location.ancestorOrigins[0]
      : document.referrer;
    const parentOrigin = new URL(parentURL).origin;
    if (origin === "*" || origin === parentOrigin) {
      window.parent.postMessage(payload, origin);
    }
  }
};

const broadcastToTop = (payload: string, origin: string) => {
  if (window.top) {
    window.top.postMessage(payload, origin);
  }
};

const broadcastToChildren = (payload: string, origin: string) => {
  Array.from(document.getElementsByTagName("iframe")).forEach((iframe) => {
    try {
      if (
        iframe.contentWindow &&
        iframe.src &&
        (origin === "*" || origin === new URL(iframe.src).origin)
      ) {
        iframe.contentWindow?.postMessage(payload, origin);
      }
    } catch (_) {
      /* ignored */
    }
  });
};
