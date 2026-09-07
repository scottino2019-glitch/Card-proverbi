/**
 * Filter function for html-to-image to exclude interactive action bars,
 * buttons, menus, and temporary toolbars from the downloaded PNG images.
 */
export const filterNoExport = (domNode: HTMLElement | Node): boolean => {
  if (!domNode) return true;
  // Always include text nodes
  if (domNode.nodeType === 3) return true;
  // Ignore non-elements
  if (domNode.nodeType !== 1) return true;

  const el = domNode as HTMLElement;

  // Filter out any button element
  if (el.tagName && el.tagName.toUpperCase() === 'BUTTON') {
    return false;
  }

  // Filter out elements marked explicitly with data-no-export="true"
  if (typeof el.getAttribute === 'function' && el.getAttribute('data-no-export') === 'true') {
    return false;
  }

  // Filter out elements with class "no-export"
  if (el.classList && el.classList.contains('no-export')) {
    return false;
  }

  // Check closest ancestor for safety
  if (typeof el.closest === 'function') {
    if (el.closest('[data-no-export="true"], .no-export, button')) {
      return false;
    }
  }

  return true;
};
