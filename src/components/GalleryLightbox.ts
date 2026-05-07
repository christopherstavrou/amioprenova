interface SerializedImageItem {
  type: 'image';
  src: string;
  alt: string;
  caption: string;
}

interface SerializedVideoItem {
  type: 'youtube' | 'vimeo';
  id: string;
  title: string;
}

type SerializedGalleryItem = SerializedImageItem | SerializedVideoItem;

// WeakMap avoids attaching a dynamic property to the DOM element.
const resizeCleanups = new WeakMap<Element, () => void>();

document.querySelectorAll('.gallery-instance').forEach(instance => {
  const lightboxMaybe  = instance.querySelector<HTMLElement>('.gallery-lightbox');
  const contentElMaybe = instance.querySelector<HTMLElement>('.gallery-content');
  const captionElMaybe = instance.querySelector<HTMLElement>('.gallery-caption');
  const counterElMaybe = instance.querySelector<HTMLElement>('.gallery-counter');
  const cardMaybe      = lightboxMaybe?.querySelector<HTMLElement>('.gl-card');

  if (!lightboxMaybe || !contentElMaybe || !captionElMaybe || !counterElMaybe || !cardMaybe) return;

  // Re-alias as non-nullable so TypeScript tracks the narrowed type in closures.
  const lightbox:  HTMLElement = lightboxMaybe;
  const contentEl: HTMLElement = contentElMaybe;
  const captionEl: HTMLElement = captionElMaybe;
  const counterEl: HTMLElement = counterElMaybe;
  const card:      HTMLElement = cardMaybe;

  const closeBtn = instance.querySelector<HTMLButtonElement>('.gallery-close');
  const prevBtn  = instance.querySelector<HTMLButtonElement>('.gallery-prev');
  const nextBtn  = instance.querySelector<HTMLButtonElement>('.gallery-next');

  let items: SerializedGalleryItem[] = [];
  let activeIndex = 0;
  let previouslyFocused: Element | null = null;

  function lockBody(): void {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockBody(): void {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  const headerEl = document.querySelector<HTMLElement>('header');

  function suppressHeader(): void {
    if (headerEl) headerEl.style.visibility = 'hidden';
  }

  function restoreHeader(): void {
    if (headerEl) headerEl.style.visibility = '';
  }

  function syncSize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    card.style.width  = `${w}px`;
    card.style.height = `${h}px`;
    if (w >= 1024) {
      card.style.maxWidth    = '64rem';
      card.style.marginLeft  = 'auto';
      card.style.marginRight = 'auto';
    } else {
      card.style.maxWidth    = 'none';
      card.style.marginLeft  = '0';
      card.style.marginRight = '0';
    }
  }

  function loadItems(grid: HTMLElement | null): SerializedGalleryItem[] {
    try {
      // Safe cast: data was serialized from the component's own frontmatter.
      return JSON.parse(grid?.dataset.galleryItems ?? '[]') as SerializedGalleryItem[];
    } catch {
      return [];
    }
  }

  function stopMedia(): void {
    contentEl.innerHTML = '';
  }

  function updateStrip(index: number): void {
    lightbox.querySelectorAll<HTMLButtonElement>('.gl-strip-thumb').forEach((btn, i) => {
      btn.classList.toggle('is-active', i === index);
      btn.tabIndex = i === index ? 0 : -1;
    });

    const activeThumb = lightbox.querySelector<HTMLElement>(`.gl-strip-thumb[data-strip-index="${index}"]`);
    const container   = activeThumb?.closest<HTMLElement>('.gl-strip-container');
    if (activeThumb && container) {
      const target = activeThumb.offsetLeft
        - container.offsetWidth  / 2
        + activeThumb.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
  }

  function renderContent(index: number): void {
    stopMedia();
    const item = items[index];
    if (!item) return;

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      contentEl.appendChild(img);
      captionEl.textContent = item.caption;
    } else {
      const wrapper = document.createElement('div');
      wrapper.className = 'gl-video';
      const iframe = document.createElement('iframe');
      iframe.src = item.type === 'youtube'
        ? `https://www.youtube.com/embed/${item.id}?autoplay=1`
        : `https://player.vimeo.com/video/${item.id}?autoplay=1`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
      iframe.allowFullscreen = true;
      iframe.title = item.title;
      wrapper.appendChild(iframe);
      contentEl.appendChild(wrapper);
      captionEl.textContent = item.title;
    }

    counterEl.textContent = `${index + 1} / ${items.length}`;
    updateStrip(index);
  }

  function navigate(delta: number): void {
    activeIndex = ((activeIndex + delta) % items.length + items.length) % items.length;
    renderContent(activeIndex);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape')     { e.preventDefault(); closeLightbox(); return; }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); return; }

    if (e.key === 'Tab') {
      const focusable = Array.from(
        lightbox.querySelectorAll<HTMLButtonElement>('button:not([tabindex="-1"])')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
  }

  function openLightbox(grid: HTMLElement | null, index: number): void {
    items = loadItems(grid);
    if (!items.length) return;
    previouslyFocused = document.activeElement;
    activeIndex = ((index % items.length) + items.length) % items.length;

    if (lightbox.parentElement !== document.body) {
      document.body.appendChild(lightbox);
    }

    syncSize();
    window.addEventListener('resize', syncSize);
    resizeCleanups.set(lightbox, () => window.removeEventListener('resize', syncSize));

    renderContent(activeIndex);
    lightbox.classList.remove('hidden');
    lockBody();
    suppressHeader();
    document.addEventListener('keydown', handleKeyDown);
    closeBtn?.focus();
  }

  function closeLightbox(): void {
    const cleanup = resizeCleanups.get(lightbox);
    if (cleanup) {
      cleanup();
      resizeCleanups.delete(lightbox);
    }

    document.removeEventListener('keydown', handleKeyDown);
    stopMedia();
    captionEl.textContent = '';
    lightbox.classList.add('hidden');
    unlockBody();
    restoreHeader();
    if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
      previouslyFocused.focus();
    }
  }

  instance.querySelectorAll<HTMLButtonElement>('.gallery-thumb').forEach(btn => {
    const grid = btn.closest<HTMLElement>('.gallery-grid');
    btn.addEventListener('click', () => openLightbox(grid, Number(btn.dataset.galleryIndex)));
  });

  lightbox.querySelectorAll<HTMLButtonElement>('.gl-strip-thumb').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = Number(btn.dataset.stripIndex);
      renderContent(activeIndex);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});
