# **So You Think You Can Be the Reply Guy**
### *A Chrome extension that makes sure you never leave X before fulfilling your sacred duty: replying to strangers.*


## What is this?

**So You Think You Can Be the Reply Guy** is a chaotic productivity tool disguised as a Chrome extension.

It counts how many **replies** you make on X (Twitter) and warns you with a browser “Are you sure?” dialog — packed with unhinged Reply Guy roast lines — if you attempt to leave the site before reaching your self-imposed quota.

If you’ve ever wanted a browser extension to:

- bully you into replying more,  
- shame you for leaving too early,  
- track your ratio like your life depends on it,  
- and spiritually transform you into That Guy™…

Then congratulations. You’ve found your calling.


## Features

- ✔️ **Counts your actual replies** (by detecting the “Replying to” interface on X)  
- ✔️ **Custom daily reply quota**  
- ✔️ **Milestone celebrations** at 10, 50, 100, 200, 500, and 1000 replies
- ✔️ **Warning block** with roast message when you try to leave  
- ✔️ **Random Reply Guy quotes**  
- ✔️ **Badge counter** showing progress  
- ✔️ **Options page** to adjust quota or reset count  
- ✔️ Works on **https://x.com** and **https://twitter.com**
- ✔️ **Minimal permissions** - only requests what it needs (storage, tabs, notifications, alarms)


## 😂 Sample “Reply Guy” Roast Lines - coming soon-

> *“Bro… you’re really gonna leave BEFORE replying? Tragic.”*

> *“Ratio alert: you’re behind on replies.”*

> *“Hold up king/queen, the timeline still needs you.”*

> *“Oh wow, leaving already? Couldn’t be me.”*

It's like having your own personal hype man — if he was significantly more annoying.


## 📦 Installation (Developer Mode)

> **Note**: This extension follows Chrome Web Store best practices with minimal permissions.

1. Download or clone this repository.  
2. Open Chrome and go to:  
   **chrome://extensions/**  
3. Turn on **Developer Mode** (top right).  
4. Click **Load unpacked**.  
5. Select the folder containing the extension.

The extension should now appear with its little badge counter.


## 🛠️ Usage

1. Open **X**.  
2. Start replying to posts like a true Reply Guy.  
3. Attempt to leave early.  
4. Get roasted.  
5. Return to the replies.  
6. Become stronger.


## 📝 Changelog

### v3.2.2 (2026-01-29)
- **New Features**:
  - Added milestone celebrations at 10, 50, 100, 200, 500, and 1000 replies
  - Celebration popups now show for both milestones and daily quota completion
  - Milestone tracking persists across sessions
- **Bug Fixes**:
  - Fixed roast popup not appearing when switching tabs on X.com
  - Prevented duplicate celebrations when milestone and quota align

### v3.2.1 (2026-01-15)
- **Security & Compliance**: Removed excess permissions for Chrome Web Store compliance
  - Removed unused `activeTab` permission
  - Removed overly broad `*://*/*` host permission
  - Removed unnecessary `<all_urls>` content script injection
  - Extension now only requests permissions it actually uses

### v3.2.0
- Initial feature-complete version with reply counting, roasting, and celebration features
