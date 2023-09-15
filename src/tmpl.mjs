async function* sub(part) {
	if (part === null || part === undefined) {}
	else if (typeof part != 'object') {
		yield String(part);
	}
	else if (part instanceof ReadableStream) {
		const encoded = part.pipeThrough(new TextDecoderStream());
		const reader = encoded.getReader();
		let closed = false;
		try {
			while (1) {
				const {value, done} = await reader.read();
				if (done) { closed = true; break; }
				yield value;
			}
		} finally {
			if (!closed) await reader.cancel();
		}
	}
	else if (part instanceof Date) {
		yield part.toUTCString();
	}
	else if (part instanceof Function) {
		yield* sub(part());
	}
	else if (part[Symbol.iterator]) {
		for (const p of part) {
			yield* sub(p);
		}
	}
	else if (part[Symbol.asyncIterator]) {
		for await (const p of part) {
			yield* sub(p);
		}
	}
	else if (part.then) {
		yield* sub(await part)
	}
	else {
		yield String(part); // If all else fails: make it into a string.
	}
}

export async function* tmpl(strings, ...parts) {
	let i = 0;
	yield strings[i];
	for (const part of parts) {
		yield* sub(part);
		yield strings[++i];
	}
}
