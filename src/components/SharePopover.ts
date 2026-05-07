document.querySelectorAll<HTMLElement>('.share-popover').forEach((root, i) => {
  const trigger = root.querySelector<HTMLElement>('.share-trigger');
  const panel   = root.querySelector<HTMLElement>('.share-panel');
  if (!trigger || !panel) return;
  const panelId = `share-panel-${i}`;
  panel.id = panelId;
  trigger.setAttribute('aria-controls', panelId);
});

function openPanel(trigger: HTMLElement): void {
  const panel = trigger.parentElement?.querySelector<HTMLElement>('.share-panel');
  if (!panel) return;
  const isHidden = panel.classList.contains('hidden');
  closeAllPanels();
  if (isHidden) {
    panel.classList.remove('hidden');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function closeAllPanels(): void {
  document.querySelectorAll<HTMLElement>('.share-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll<HTMLElement>('.share-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
}

document.addEventListener('click', async (e) => {
  if (!(e.target instanceof Element)) return;
  const target = e.target;
  const trigger = target.closest<HTMLElement>('.share-trigger');
  const copyBtn = target.closest<HTMLElement>('.copy-link-btn');

  if (trigger) {
    e.stopPropagation();
    const url = trigger.dataset.shareUrl;
    const shareTitle = trigger.dataset.shareTitle;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') openPanel(trigger);
      }
      return;
    }
    openPanel(trigger);

  } else if (copyBtn) {
    e.stopPropagation();
    const url = copyBtn.dataset.copyUrl ?? '';
    const span = copyBtn.querySelector<HTMLElement>('span');
    try {
      await navigator.clipboard.writeText(url);
      if (span) {
        span.textContent = copyBtn.dataset.copiedLabel ?? 'Copied!';
        setTimeout(() => {
          span.textContent = copyBtn.dataset.copyLabel ?? 'Copy link';
        }, 2000);
      }
    } catch {
      // clipboard API unavailable
    }

  } else if (!target.closest('.share-panel')) {
    closeAllPanels();
  }
});
