
document.addEventListener('DOMContentLoaded', () => {
  const alphabets = Array.from(document.querySelectorAll('.alphabet'));
  const playAllBtn = document.getElementById('playAllBtn');
  const audioPlayer = new Audio();
  audioPlayer.preload = 'auto';

  let seqPlaying = false;
  let seqPaused = false;
  let seqIndex = 0;
  const GAP_MS = 1000;

  // ---- Utility: Highlighting ----
  function setPlayingHighlight(index) {
    alphabets.forEach((el, i) => {
      if (i === index) el.classList.add('playing');
      else el.classList.remove('playing');
    });
  }

  function clearHighlight() {
    alphabets.forEach(el => el.classList.remove('playing'));
  }

  // ---- Hover Play (disabled during Play All) ----
  alphabets.forEach((el, idx) => {
    el.addEventListener('mouseenter', () => {
      if (seqPlaying) return;
      playSingle(idx);
    });
    el.addEventListener('mouseleave', () => {
      if (seqPlaying) return;
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      clearHighlight();
    });
  });

  function playSingle(index) {
    const src = alphabets[index].dataset.audio;
    if (!src) return;
    audioPlayer.src = src;
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    setPlayingHighlight(index);
  }

  // ---- Play All Logic ----
  async function playSequence() {
    while (seqPlaying && seqIndex < alphabets.length) {
      setPlayingHighlight(seqIndex);
      await playTrack(seqIndex);
      if (!seqPlaying) break;
      seqIndex++;
      if (seqIndex < alphabets.length) await delay(GAP_MS);
    }
    if (seqIndex >= alphabets.length) {
      stopSequence();
    }
  }

  function playTrack(index) {
    return new Promise((resolve) => {
      const src = alphabets[index].dataset.audio;
      audioPlayer.src = src;
      audioPlayer.currentTime = 0;
      audioPlayer.play();

      audioPlayer.onended = () => resolve();
      audioPlayer.onerror = () => resolve();
    });
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ---- Controls ----
  function startSequence() {
    seqPlaying = true;
    seqPaused = false;
    playAllBtn.textContent = "Pause";
    playSequence();
  }

  function pauseSequence() {
    seqPaused = true;
    seqPlaying = false;
    audioPlayer.pause();
    playAllBtn.textContent = "Resume";
  }

  function stopSequence() {
    seqPlaying = false;
    seqPaused = false;
    seqIndex = 0;
    audioPlayer.pause();
    clearHighlight();
    playAllBtn.textContent = "Play All";
  }

  playAllBtn.addEventListener('click', () => {
    if (!seqPlaying && !seqPaused) {
      seqIndex = 0;
      startSequence();
    } else if (seqPlaying) {
      pauseSequence();
    } else if (seqPaused) {
      seqPlaying = true;
      seqPaused = false;
      playAllBtn.textContent = "Pause";
      audioPlayer.play();
      playSequence();
    }
  });
});

