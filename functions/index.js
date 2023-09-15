import { tmpl } from "../src/tmpl.mjs";

export function shell(title, body) {
	return tmpl`<!DOCTYPE html>
<html>
	<head>
		<title>${title}</title>
	</head>
	<body>
		<header>
			<h1><a href="/">Evan Brass</a></h1>
		</header>
		<main>
			${body}
		</main>
	</body>
</html>`
}

export async function onRequestGet({request, env}) {
	return new Response(shell('Evan Brass', tmpl`Hello World`));
}
