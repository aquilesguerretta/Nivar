# Source action target verification

Only the source action CSS changed in this pass. Its actual DOM rectangle is 44 × 40px on desktop and 44 × 44px on phone. Negative block margins retain the prior visible heading/lens geometry; the expanded target stays inside the lens.

`source-touch-checks.json` records eight native cases: 1440/390px × standalone/House preview × default/peak. Each confirms sample index 14/19, an unobscured selected dot in the viewport, and successful hit tests at the top, center and bottom of the source button. The lens remains 208 × 106.84px on desktop and 180 × 109.84px on phone. Browser exceptions: zero. Phone captures are `390-source-focus-{standalone,house}-{default,peak}.png`.

The follow-up closed the other new-control findings: timeline buttons are now 40px desktop/44px phone, mobile map toggle 44px, and the range input box 44px with the thin visual track retained. `new-targets-checks.json` verifies 44px actual rectangles for every new phone target in standalone and House contexts. The selected point and source target stay clear, the lens ends above the range, neither composition overflows, and a native ArrowRight advances the fixture index from 14 to 15. Browser exceptions: zero. Latest native captures are `390-new-targets-standalone.png` and `390-new-targets-house.png`. Existing notebook note buttons and metric/period geometry were not changed.
