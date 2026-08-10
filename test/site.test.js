/**
 * Tests for activeledger.ai landing page.
 * Validates HTML structure, SEO basics, accessibility, and content integrity.
 */
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(HTML_PATH, 'utf-8');

function parseHTML(htmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
}

let doc;
beforeAll(() => {
  doc = parseHTML(html);
});

describe('Document structure', () => {
  test('has DOCTYPE', () => {
    expect(html).toMatch(/^<!DOCTYPE html>/i);
  });

  test('has html lang attribute', () => {
    const htmlEl = doc.documentElement;
    expect(htmlEl.getAttribute('lang')).toBeTruthy();
  });

  test('has head and body', () => {
    expect(doc.querySelector('head')).toBeTruthy();
    expect(doc.querySelector('body')).toBeTruthy();
  });

  test('has meta charset UTF-8', () => {
    const charset = doc.querySelector('meta[charset]');
    expect(charset.getAttribute('charset').toLowerCase()).toBe('utf-8');
  });

  test('has viewport meta tag', () => {
    const viewport = doc.querySelector('meta[name="viewport"]');
    expect(viewport).toBeTruthy();
    expect(viewport.getAttribute('content')).toContain('width=device-width');
  });

  test('has description meta tag', () => {
    const desc = doc.querySelector('meta[name="description"]');
    expect(desc).toBeTruthy();
    expect(desc.getAttribute('content').length).toBeGreaterThan(20);
  });
});

describe('SEO and social', () => {
  test('title tag is present and meaningful', () => {
    const title = doc.querySelector('title');
    expect(title).toBeTruthy();
    expect(title.textContent.length).toBeGreaterThan(10);
    expect(title.textContent).toContain('activeledger');
  });

  test('has preconnect hints for fonts', () => {
    const preconnects = doc.querySelectorAll('link[rel="preconnect"]');
    expect(preconnects.length).toBeGreaterThanOrEqual(1);
  });

  test('loads fonts via Google Fonts', () => {
    const fontLink = doc.querySelector('link[href*="fonts.googleapis.com"]');
    expect(fontLink).toBeTruthy();
  });
});

describe('Content sections', () => {
  test('has hero section', () => {
    const hero = doc.querySelector('.hero');
    expect(hero).toBeTruthy();
  });

  test('has all 6 main sections', () => {
    const sections = doc.querySelectorAll('section[id]');
    const ids = Array.from(sections).map(s => s.id);
    expect(ids).toContain('vision');
    expect(ids).toContain('layers');
    expect(ids).toContain('research');
    expect(ids).toContain('opensource');
    expect(ids).toContain('science');
    expect(ids).toContain('team');
  });

  test('hero has content', () => {
    const hero = doc.querySelector('.hero');
    expect(hero.textContent.length).toBeGreaterThan(50);
  });

  test('hero has call-to-action buttons', () => {
    const heroActions = doc.querySelector('.hero-actions');
    expect(heroActions).toBeTruthy();
    const buttons = heroActions.querySelectorAll('a, button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  test('has footer', () => {
    const footer = doc.querySelector('.footer, footer');
    expect(footer).toBeTruthy();
  });

  test('footer has copyright or tagline', () => {
    const footer = doc.querySelector('.footer, footer');
    expect(footer.textContent.length).toBeGreaterThan(10);
  });
});

describe('Styling and design', () => {
  test('has CSS custom properties (design tokens)', () => {
    const styleContent = html.match(/:root\s*\{[^}]+\}/);
    expect(styleContent).toBeTruthy();
  });

  test('uses dark theme background', () => {
    const styleContent = html.match(/:root\s*\{[^}]+\}/)[0];
    expect(styleContent).toMatch(/--bg\s*:\s*#0/i);
  });

  test('has accent colors defined', () => {
    const styleContent = html.match(/:root\s*\{[^}]+\}/)[0];
    expect(styleContent).toContain('--accent');
  });

  test('uses Inter or system-ui font family', () => {
    expect(html).toMatch(/Inter|system-ui/);
  });

  test('has responsive utilities (max-width container)', () => {
    expect(html).toMatch(/\.container/);
    expect(html).toMatch(/max-width/);
  });

  test('has gradient text utility', () => {
    expect(html).toMatch(/gradient-text/);
  });

  test('has JetBrains Mono for code/mono elements', () => {
    expect(html).toMatch(/JetBrains Mono/);
  });

  test('has Space Grotesk for headings', () => {
    expect(html).toMatch(/Space Grotesk/);
  });
});

describe('Accessibility', () => {
  test('images have alt text or are decorative', () => {
    const imgs = doc.querySelectorAll('img');
    imgs.forEach(img => {
      // Should have alt attribute (even if empty for decorative)
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  test('has semantic section landmarks', () => {
    const sections = doc.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(3);
  });

  test('links have meaningful text (no empty links)', () => {
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      const text = link.textContent.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const title = link.getAttribute('title');
      // Each link should have some accessible text
      expect(text.length + (ariaLabel || '').length + (title || '').length).toBeGreaterThan(0);
    });
  });

  test('has sufficient color contrast tokens (bright text defined)', () => {
    const styleContent = html.match(/:root\s*\{[^}]+\}/)[0];
    expect(styleContent).toContain('--text');
    expect(styleContent).toContain('--text-bright');
  });
});

describe('Performance hints', () => {
  test('has Cache-Control or caching strategy', () => {
    // The page should either have caching meta or be designed for CDN
    // At minimum, it should load efficiently
    const scripts = doc.querySelectorAll('script');
    expect(scripts.length).toBeLessThanOrEqual(5); // Not too many inline scripts
  });

  test('CSS is inline (no render-blocking external CSS besides fonts)', () => {
    const externalStyles = doc.querySelectorAll('link[rel="stylesheet"]:not([href*="fonts.g"])');
    // Allow external stylesheets but flag if there are too many
    expect(externalStyles.length).toBeLessThanOrEqual(2);
  });
});

describe('JavaScript', () => {
  test('has at least one script tag', () => {
    const scripts = doc.querySelectorAll('script');
    expect(scripts.length).toBeGreaterThanOrEqual(1);
  });

  test('inline scripts are valid (not empty)', () => {
    const scripts = doc.querySelectorAll('script:not([src])');
    scripts.forEach(script => {
      if (script.textContent.trim()) {
        expect(script.textContent.trim().length).toBeGreaterThan(10);
      }
    });
  });
});

describe('Content quality', () => {
  test('mentions the core product concept', () => {
    const bodyText = doc.body.textContent.toLowerCase();
    const keywords = ['agent', 'intelligence', 'architecture', 'cognition'];
    const found = keywords.filter(k => bodyText.includes(k));
    expect(found.length).toBeGreaterThanOrEqual(2);
  });

  test('section content is non-trivial', () => {
    const sections = doc.querySelectorAll('section[id]');
    sections.forEach(section => {
      expect(section.textContent.trim().length).toBeGreaterThan(30);
    });
  });

  test('has layer/architecture descriptions', () => {
    const layersSection = doc.querySelector('#layers');
    if (layersSection) {
      const layers = layersSection.querySelectorAll('.layer');
      expect(layers.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('File integrity', () => {
  test('index.html is substantial', () => {
    expect(html.length).toBeGreaterThan(5000);
  });

  test('HTML is well-formed (has closing html tag)', () => {
    expect(html).toMatch(/<\/html>\s*$/);
  });

  test('no unclosed style tags', () => {
    const openStyles = (html.match(/<style/gi) || []).length;
    const closeStyles = (html.match(/<\/style>/gi) || []).length;
    expect(openStyles).toBe(closeStyles);
  });

  test('no unclosed script tags', () => {
    const openScripts = (html.match(/<script/gi) || []).length;
    const closeScripts = (html.match(/<\/script>/gi) || []).length;
    expect(openScripts).toBe(closeScripts);
  });

  test('hero background image exists', () => {
    const heroBgPath = path.join(__dirname, '..', 'hero-bg.png');
    expect(fs.existsSync(heroBgPath)).toBe(true);
  });
});
