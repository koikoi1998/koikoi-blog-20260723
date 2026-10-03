---
title: "[Listen] The Web/API Series, Fully Recapped"
description: "An audio-learning article that reviews all 6 articles of the Web/API series by ear, during a commute or while doing chores. No tables, diagrams, or bullet points — just spoken-style prose meant to be read aloud by a browser's text-to-speech feature."
series: "api"
subSeries: "audio"
order: 7
tags: ["api", "audio-review", "web"]
emoji: "🎧"
pubDate: 2026-10-15
---

This article is an audio-learning recap for anyone who's already read all six articles in the Web/API series. Use your browser's or phone's text-to-speech feature and let it play in the background during a commute or while doing chores. There are no diagrams, tables, or code here — just spoken-style prose, stitching the whole series back together into a single, continuous thread.

The series started with the fundamentals of what a RESTful API actually is. The starting point was that protocol and API are concepts at entirely separate layers — individual services publish their own distinct API, their own window, on top of HTTP, a shared, common set of manners. Every HTTP method carries its own meaning: GET and PUT are idempotent, designed so the result stays the same no matter how many times you run them, while POST is non-idempotent, potentially creating a new resource every time it runs. We also covered that authentication in a stateless world requires including a token with every single request, and how pagination returns a huge set of resources broken into pieces.

Next came what's actually happening behind a payment API. Using Stripe as the example, we covered why payment never wraps up with a single, simple API call — it has a multi-stage lifecycle called PaymentIntent — and why a mechanism called a webhook becomes necessary to correctly detect when a payment actually completes. Never letting sensitive information, like a card number, touch the merchant's own server at all was another important theme covered here.

Then came putting everything from the lecture into practice, hands-on, actually building an API server yourself. You confirmed POST's non-idempotent behavior — sending it twice creates two separate resources with different IDs. And you confirmed PUT's idempotent behavior — sending the same content to the same ID twice always converges the server's state to the exact same single result. You got to feel firsthand that idempotency isn't something the HTTP spec automatically guarantees — it's a design agreement realized through the server's own implementation.

From here, the series moved into more advanced territory. First, OAuth 2.0. The mechanism running behind a "Log in with Google" button turned out to be, not authentication, but authorization. We covered the authorization code flow's two-stage design, built specifically to keep the powerful access token from ever traveling directly down the low-security browser redirect path. And we covered that achieving user authentication itself requires a separate spec, OpenID Connect, layered on top of OAuth 2.0.

Next came the difference between GraphQL and RESTful APIs. REST carries two contrasting problems: over-fetching, receiving more data than needed, and under-fetching, needing multiple calls just to render one screen. GraphQL eliminates both by letting the client side specify the exact shape of data it wants, as a query. The right way to understand this was never "which one is better" — it was a design-philosophy difference in who should decide the response's shape, the server side or the client side.

The final article put building a webhook receiver into practice, hands-on, with your own hands. Using an HMAC signature, the receiver recomputed the signature itself, with the same shared secret, and compared it against the signature that was sent, to verify the request genuinely came from its legitimate sender. Tampering with the payload's content made that verification fail, correctly rejected with a 401 error. And you confirmed a deduplication mechanism too — sending a request with the same event ID twice skipped the actual processing on the second attempt. Signature verification and deduplication, serving entirely separate purposes as two separate defenses, took concrete shape here as actual implementation.

Looking back across all six articles, one consistent pattern emerges. The meaning behind idempotency itself, a payment API's multi-stage lifecycle, OAuth 2.0's distinction between authentication and authorization, REST versus GraphQL's difference over who decides the response's shape, and the distinction between signature verification and deduplication in a webhook — every one of them shared the same shape: behind one seemingly simple operation or term, several independent concepts or design decisions are actually combined together. Looking at an API's behavior in front of you, and digging one layer deeper to ask what the real design intent underneath actually is. That's the perspective a top-1% engineer carries away from this series. And that's the recap of the Web/API series, complete.
