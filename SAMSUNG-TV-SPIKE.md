# Samsung TV feasibility spike

Research date: October 17, 2026.

## Finding

A Samsung Smart TV application is a plausible path for Magic Window without an external HDMI computer. Samsung officially supports packaged Tizen Web applications made from HTML, CSS, and JavaScript, making the existing web-based renderer a reasonable starting point.

This is a documentation-based feasibility result. No Samsung application has been built, signed, installed, submitted, or approved, and no physical-TV performance or lifecycle testing has been completed.

## Important architectural distinction

A packaged application should include its rendering and behavior code. It can be designed to retrieve approved world data and content assets from a service, subject to Samsung network, security, and certification requirements.

Do not assume that a minimal application which simply opens the current hosted website will be accepted. Samsung's Hosted Applications FAQ says hosted applications are generally not allowed for submission, with exceptions requiring advance discussion with a Content Manager. External script loading also requires permission. The technical ability to display a remote page is not evidence of store eligibility.

Implication for generated additions: keep executable application changes on the appropriate signed application/update path. Investigate treating world state, schedules, sprite images, and other non-executable content as data consumed by an existing renderer. Arbitrary generated executable code is a separate distribution and approval question.

## Distribution

Samsung Apps TV Seller Office handles application registration and certification. Samsung currently documents Public Seller distribution as US-only; distribution to other countries requires Partner Seller status and agreement. This does not establish approval for this particular application or guarantee eligibility in every region/model group.

Testing a development application does not require first obtaining public store approval. Samsung documents development-device installation with developer mode, a signing certificate, a development computer, and a supported TV connection.

## Next technical test

Prepare a minimal packaged TV application using the existing scene before investing in production-quality artwork.

Acceptance criteria:

- Installs and launches on a supported Samsung TV through the documented development process.
- Displays the scene without browser chrome, scrolling, or clipped edges.
- Provides appropriate remote Back/Exit behavior and lifecycle handling.
- Demonstrates acceptable animation performance with representative artwork and resident counts.
- Handles screensaver behavior appropriately for passive viewing.
- Preserves or restores state after leaving and reopening the application.
- Handles temporary network loss without breaking the existing scene.
- Establishes what startup/resume behavior is actually available; do not assume automatic launch on power-on.
- Records tested model year, firmware, resolution, and limitations without publishing personal device identifiers.

Samsung provides a screensaver API and requires appropriate handling for certification. The documentation covers passive viewing such as video and slideshows; the intended ambient canvas experience still needs testing and certification assessment.

A native TV application does not automatically imply integration with The Frame's separate Art Mode. Art Mode integration is outside this initial spike.

## Recommendation

Investigate the packaged Samsung application route before requiring extra hardware. Keep the portable web renderer so an HDMI computer remains an alternative. Store availability, actual-device performance, passive-viewing behavior, and update policy remain gates.

The earlier statement that a TV app-store release was unnecessary described a prototype direction. Avoiding external hardware makes Samsung application distribution a candidate worth evaluating; it is not a commitment to public release.

## Official sources

- [Samsung TV Web application quick-start guide](https://developer.samsung.com/smarttv/develop/getting-started/quick-start-guide.html): HTML/CSS/JavaScript application structure, signing, TV-specific behavior.
- [Hosted applications FAQ](https://developer.samsung.com/smarttv/develop/faq/hosted-applications.html): hosted application restrictions and external script permissions.
- [Seller Office membership](https://developer.samsung.com/tv-seller-office/guides/membership/becoming-seller-office-member.html): Public and Partner Seller distribution.
- [TV device testing](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html): developer mode, certificates, and physical-device testing.
- [Setting screensaver](https://developer.samsung.com/smarttv/develop/guides/fundamentals/setting-screensaver.html): passive viewing and certification requirements.
