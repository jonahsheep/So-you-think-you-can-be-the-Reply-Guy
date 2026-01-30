const requiredEl = document.getElementById('requiredReplies');
const currentCountEl = document.getElementById('currentCount');
const badgeEl = document.getElementById('progressBadge');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');
const easyModeBtn = document.getElementById('easyModeBtn');
const hardModeBtn = document.getElementById('hardModeBtn');
const modeDesc = document.getElementById('modeDesc');

// Helper to show transient status
function showMsg(text) {
  statusMsg.innerText = text;
  statusMsg.classList.add('visible');
  setTimeout(() => statusMsg.classList.remove('visible'), 2000);
}

function updateUI(count, required) {
  currentCountEl.innerText = count;
  requiredEl.value = required;

  if (count >= required) {
    badgeEl.innerText = "Quota Met";
    badgeEl.style.color = "#9ece6a";
    badgeEl.style.background = "rgba(158, 206, 106, 0.2)";
  } else {
    badgeEl.innerText = `${required - count} Left`;
    badgeEl.style.color = "#f7768e";
    badgeEl.style.background = "rgba(247, 118, 142, 0.2)";
  }
}

async function load() {
  const data = await chrome.storage.sync.get(['requiredReplies', 'count', 'mode']);
  const mode = data.mode || 'hard'; // Default to hard mode
  updateUI(data.count || 0, data.requiredReplies || 3);
  updateModeUI(mode);
}

function updateModeUI(mode) {
  if (mode === 'easy') {
    easyModeBtn.classList.add('active');
    hardModeBtn.classList.remove('active');
    modeDesc.textContent = 'Prompts you when leaving X before quota is met';
  } else {
    hardModeBtn.classList.add('active');
    easyModeBtn.classList.remove('active');
    modeDesc.textContent = 'Blocks navigation away from X until quota is met';
  }
}

// Mode selection handlers
easyModeBtn.addEventListener('click', async () => {
  await chrome.storage.sync.set({ mode: 'easy' });
  updateModeUI('easy');
  showMsg('Mode Updated');
});

hardModeBtn.addEventListener('click', async () => {
  await chrome.storage.sync.set({ mode: 'hard' });
  updateModeUI('hard');
  showMsg('Mode Updated');
});

saveBtn.addEventListener('click', async () => {
  let val = parseInt(requiredEl.value, 10);
  if (!val || val < 1) val = 1;
  await chrome.storage.sync.set({ requiredReplies: val });

  // Refresh UI to update badge calculation
  const data = await chrome.storage.sync.get(['count']);
  updateUI(data.count || 0, val);

  showMsg('Settings Saved');
  chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
});

resetBtn.addEventListener('click', async () => {
  // Reset count and update date
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const today = (new Date(date - offset)).toISOString().slice(0, 10);

  await chrome.storage.sync.set({
    count: 0,
    lastResetDate: today,
    quotaCelebrated: false // Reset quota celebration
  });

  const data = await chrome.storage.sync.get(['requiredReplies']);
  updateUI(0, data.requiredReplies || 3);

  showMsg('Count Reset');
  chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
});

// Listen for live updates (if content script increments while options open)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    load();
  }
});

document.addEventListener('DOMContentLoaded', load);