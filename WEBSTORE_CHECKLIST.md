# Chrome Web Store Submission Checklist

## Permissions
✅ Only essential permissions requested:
- `storage` - for saving reply counts and settings
- `tabs` - for querying active tab to send messages
- `notifications` - for roast notifications
- `alarms` - for daily reset checks

## Host Permissions
✅ Only specific domains:
- `*://*.x.com/*` - X/Twitter domain
- `*://*.twitter.com/*` - Legacy Twitter domain

## Content Scripts
✅ Only injected on X/Twitter domains
✅ No unnecessary global injection (<all_urls>)

## Privacy & Security
✅ No data collection
✅ No external API calls
✅ All data stored locally via chrome.storage.sync
✅ No analytics or tracking
