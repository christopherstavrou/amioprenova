/**
 * Shared inline video player logic.
 * Import this in any page that has .video-card elements.
 * Only one video plays at a time across all cards on the page.
 */

let activeCard: HTMLElement | null = null;

function stopActive() {
  if (!activeCard) return;
  const player = activeCard.querySelector<HTMLElement>('.video-player');
  const thumb = activeCard.querySelector<HTMLElement>('.video-thumb');
  if (player) {
    player.innerHTML = '';
    player.classList.add('hidden');
  }
  if (thumb) thumb.classList.remove('hidden');
  activeCard = null;
}

function playVideo(card: HTMLElement) {
  const id = card.dataset.youtubeId;
  if (!id) return;
  if (activeCard === card) return;

  stopActive();

  const thumb = card.querySelector<HTMLElement>('.video-thumb');
  const player = card.querySelector<HTMLElement>('.video-player');
  if (!thumb || !player) return;

  thumb.classList.add('hidden');

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  iframe.title = 'YouTube video player';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.className = 'w-full h-full';
  player.appendChild(iframe);
  player.classList.remove('hidden');

  activeCard = card;
}

document.querySelectorAll<HTMLElement>('.video-card').forEach(card => {
  const thumb = card.querySelector<HTMLElement>('.video-thumb');
  if (thumb) {
    thumb.addEventListener('click', () => playVideo(card));
  }
});
