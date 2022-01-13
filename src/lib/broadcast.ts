import { hasOpener } from "./has-opener";

export function broadcast(
  frame: Window,
  payload: string,
  origin: string,
  broadcastMode: string
): void {

  try {
	if(broadcastMode === 'self'){
		if(origin === '*' || origin === location.origin){
			window.self.postMessage(payload, origin);
		}
	}
	else if(broadcastMode === 'parent'){
		if(window.parent && window.self !== window.parent){
			// firefox does not support ancestorOrigins
			// referrer could be affected by the referrer policy
			const parentURL = document.location.ancestorOrigins ? document.location.ancestorOrigins[0] : document.referrer;
            const parentOrigin = new URL(parentURL).origin;
			if(origin === '*' || origin === parentOrigin){
				window.parent.postMessage(payload, origin);
			}
        }
	}
	else if(broadcastMode === 'top'){
		if(window.top){
			window.top.postMessage(payload, origin);
		}
	}
	else if(broadcastMode === 'children'){
		Array.from(document.getElementsByTagName('iframe'))
			.forEach(iframe => {
				try{
					if(iframe.contentWindow && iframe.src && origin === new URL(iframe.src).origin){
						iframe.contentWindow?.postMessage(payload, origin);
					}
				} catch (_) { /* ignored */ }
			});
	}
	else {
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
	}
  } catch (_) {
    /* ignored */
  }
}