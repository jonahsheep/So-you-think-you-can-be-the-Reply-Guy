const DEFAULT_REQUIRED = 3;

// --- 1. FUNCTIONS (DEFINED FIRST TO PREVENT CRASHES) ---

function isoDateToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return (new Date(date - offset)).toISOString().slice(0, 10);
}

async function updateBadge() {
  try {
    const data = await chrome.storage.sync.get(["count", "requiredReplies"]);
    const count = (data && data.count) ? data.count : 0;
    const required = (data && data.requiredReplies) ? data.requiredReplies : DEFAULT_REQUIRED;

    await chrome.action.setBadgeText({ text: String(count) });

    if (count >= required) {
      await chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" }); // Green
    } else {
      await chrome.action.setBadgeBackgroundColor({ color: "#333333" }); // Dark
    }
  } catch (e) {
    console.error("Badge Error:", e);
  }
}



async function checkDailyReset() {
  try {
    const data = await chrome.storage.sync.get(["lastResetDate"]);
    const today = isoDateToday();

    if (!data.lastResetDate || data.lastResetDate !== today) {
      console.log("New day. Resetting count.");
      await chrome.storage.sync.set({
        count: 0,
        lastResetDate: today,
        quotaCelebrated: false // Reset quota celebration for new day
      });
      updateBadge();
    }
  } catch (e) {
    console.error("Reset Error:", e);
  }
}

async function ensureDefaults() {
  try {
    const data = await chrome.storage.sync.get(["requiredReplies", "count", "lastResetDate"]);
    const updates = {};
    if (!data.requiredReplies) updates.requiredReplies = DEFAULT_REQUIRED;
    if (data.count === undefined) updates.count = 0;
    if (!data.lastResetDate) updates.lastResetDate = isoDateToday();

    if (Object.keys(updates).length > 0) {
      await chrome.storage.sync.set(updates);
    }
    updateBadge();
  } catch (e) {
    console.error("Defaults Error:", e);
  }
}

// --- 2. BULLYING LOGIC ---
const ROASTS = [
  "Your followers are waiting for your bad takes. Get back in there.",
  "You call yourself a Reply Guy? I call you a quitter.",
  "Leaving so soon? The algorithm is crying.",
  "One does not simply walk away from the timeline.",
  "Your engagement metrics are dropping. Panic.",
  "I saw you switch tabs. Disappointing.",
  "Do you want to be irrelevant? Because this is how you become irrelevant."
];

async function bullyUser() {
  const data = await chrome.storage.sync.get(["count", "requiredReplies"]);
  const count = (data && data.count) ? data.count : 0;
  const required = (data && data.requiredReplies) ? data.requiredReplies : DEFAULT_REQUIRED;

  if (count < required) {
    const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];

    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Get Back To Work',
        message: `${roast} (${count}/${required})`,
        priority: 2
      });
    } catch (notifError) {
      console.log("Notification also failed:", notifError);
    }
  }
}

// --- 3. LISTENERS (NOW IT IS SAFE TO CALL FUNCTIONS) ---

chrome.runtime.onInstalled.addListener(() => {
  ensureDefaults();
  chrome.alarms.create("dailyCheck", { periodInMinutes: 15 });
});

chrome.runtime.onStartup.addListener(() => {
  ensureDefaults();
  checkDailyReset();
});

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === "dailyCheck") checkDailyReset();
});

// --- 4. NAVIGATION BLOCKING ---
// Block navigation away from X/Twitter when quota not met
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only check top-level navigation (not iframes)
  if (details.frameId !== 0) return;

  const url = new URL(details.url);
  const currentIsX = url.hostname.includes('x.com') || url.hostname.includes('twitter.com');

  // If navigating away from X/Twitter
  if (!currentIsX) {
    try {
      const data = await chrome.storage.sync.get(["count", "requiredReplies"]);
      const count = (data && data.count) ? data.count : 0;
      const required = (data && data.requiredReplies) ? data.requiredReplies : DEFAULT_REQUIRED;
    } catch (e) {
      console.error("Navigation blocking error:", e);
    }
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'increment') {
    (async () => {
      await checkDailyReset();
      const data = await chrome.storage.sync.get(["count", "requiredReplies", "quotaCelebrated"]);
      const newCount = ((data && data.count) ? data.count : 0) + 1;
      const required = (data && data.requiredReplies) ? data.requiredReplies : DEFAULT_REQUIRED;
      const quotaCelebrated = data.quotaCelebrated || false;

      await chrome.storage.sync.set({ count: newCount });
      updateBadge();

      // Check if quota is met for the first time today
      if (newCount >= required && !quotaCelebrated) {
        console.log(`Daily quota met: ${newCount}/${required}`);
        await chrome.storage.sync.set({ quotaCelebrated: true });

        // Show quota celebration only on active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          try {
            await chrome.tabs.sendMessage(tabs[0].id, {
              type: 'SHOW_CELEBRATION',
              milestone: required,
              totalCount: newCount,
              isQuota: true
            });
          } catch (e) {
            // Tab might not have content script
          }
        }
      }

      sendResponse({ success: true, newCount });
    })();
    return true; // Keep channel open
  }

  if (msg.type === 'USER_LEFT_TAB') {
    (async () => {
      const data = await chrome.storage.sync.get(["count", "requiredReplies"]);
      const count = (data && data.count) ? data.count : 0;
      const required = (data && data.requiredReplies) ? data.requiredReplies : DEFAULT_REQUIRED;

      if (count < required) {
        const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];

        // Send notification
        try {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Get Back To Work',
            message: `${roast} (${count}/${required})`,
            priority: 2
          });
        } catch (notifError) {
          console.log("Notification failed:", notifError);
        }

        // Send popup to active tab only
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          try {
            await chrome.tabs.sendMessage(tabs[0].id, {
              type: 'SHOW_ROAST_POPUP',
              roast: roast,
              count: count,
              required: required
            });
          } catch (e) {
            console.log("Could not send roast popup:", e);
          }
        }
      }
    })();
  }

  if (msg.type === 'UPDATE_BADGE') {
    updateBadge();
  }
});