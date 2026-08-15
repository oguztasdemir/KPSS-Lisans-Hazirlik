/**
 * KaTeX Math / Formula Auto-Render Utility
 */
export function renderMath(element) {
  if (!element) return;

  const doRender = () => {
    if (typeof window !== 'undefined' && window.renderMathInElement) {
      try {
        window.renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('KaTeX render error:', e);
      }
    }
  };

  if (typeof window !== 'undefined' && window.renderMathInElement) {
    doRender();
  } else {
    // Retry if CDN script is still hydrating
    setTimeout(doRender, 100);
    setTimeout(doRender, 400);
  }
}
