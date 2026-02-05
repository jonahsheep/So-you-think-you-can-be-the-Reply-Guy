(function () {
  let popupShown = false;
  let lastShownTime = 0;

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'SHOW_ROAST_POPUP') {
      // Allow showing popup if it hasn't been shown in the last 5 seconds (prevent spam)
      const now = Date.now();
      if (!popupShown || (now - lastShownTime) > 5000) {
        showRoastPopup(msg.roast, msg.count, msg.required);
        popupShown = true;
        lastShownTime = now;
      }
    }
  });

  function showRoastPopup(roast, count, required) {
    // Prevent multiple popups
    if (document.getElementById('reply-guy-roast-backdrop')) return;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'reply-guy-roast-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(12px);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: replyGuyFadeIn 0.3s ease-out forwards;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'reply-guy-roast-popup';
    popup.style.cssText = `
      background: linear-gradient(145deg, #161616 0%, #242424 100%);
      border: 1px solid rgba(255, 95, 87, 0.3);
      border-radius: 24px;
      padding: 48px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 30px 100px rgba(255, 95, 87, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.05);
      text-align: center;
      animation: replyGuyPopIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      position: relative;
      overflow: hidden;
    `;

    // Glow effect
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 95, 87, 0.1) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    `;
    popup.appendChild(glow);

    // Create content container (to sit above glow)
    const content = document.createElement('div');
    content.style.cssText = `position: relative; z-index: 1;`;

    const title = document.createElement('h1');
    title.textContent = 'EYFS! GET BACK TO WORK';
    title.style.cssText = `
      color: #ff5f57;
      font-size: 32px;
      margin: 0 0 16px 0;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 20px rgba(255, 95, 87, 0.4);
    `;

    const message = document.createElement('p');
    message.textContent = roast;
    message.style.cssText = `
      color: #e0e0e0;
      font-size: 20px;
      margin: 0 0 32px 0;
      line-height: 1.5;
      font-weight: 500;
    `;

    const statsContainer = document.createElement('div');
    statsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;
      gap: 12px;
    `;

    const stats = document.createElement('div');
    stats.textContent = `${count} / ${required} REPLIES DONE`;
    stats.style.cssText = `
      color: #8d8d8d;
      font-size: 14px;
      font-family: 'JetBrains Mono', monospace;
      background: rgba(0, 0, 0, 0.4);
      padding: 8px 16px;
      border-radius: 100px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      letter-spacing: 1px;
    `;

    // Progress Bar
    const progressTrack = document.createElement('div');
    progressTrack.style.cssText = `
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    `;
    const progressFill = document.createElement('div');
    const percent = Math.min((count / required) * 100, 100);
    progressFill.style.cssText = `
      width: ${percent}%;
      height: 100%;
      background: #ff5f57;
      box-shadow: 0 0 10px rgba(255, 95, 87, 0.8);
      transition: width 1s ease-out;
    `;
    progressTrack.appendChild(progressFill);

    statsContainer.appendChild(stats);
    statsContainer.appendChild(progressTrack);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    const goBackButton = document.createElement('button');
    goBackButton.textContent = 'Fine, I\'ll Go to X';
    goBackButton.style.cssText = `
      background: #ff5f57;
      color: white;
      border: none;
      padding: 18px 32px;
      font-size: 18px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 25px rgba(255, 95, 87, 0.3);
    `;

    const keepScrollingButton = document.createElement('button');
    keepScrollingButton.textContent = 'Keep Scrolling (I\'m a quitter)';
    keepScrollingButton.style.cssText = `
      background: transparent;
      color: #8d8d8d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 14px 32px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;

    goBackButton.onclick = () => {
      closePopup();
      window.location.href = 'https://x.com/home';
    };

    keepScrollingButton.onclick = () => {
      closePopup();
    };

    goBackButton.onmouseover = () => {
      goBackButton.style.transform = 'translateY(-2px) scale(1.02)';
      goBackButton.style.boxShadow = '0 12px 30px rgba(255, 95, 87, 0.4)';
    };
    goBackButton.onmouseout = () => {
      goBackButton.style.transform = 'translateY(0) scale(1)';
      goBackButton.style.boxShadow = '0 8px 25px rgba(255, 95, 87, 0.3)';
    };

    keepScrollingButton.onmouseover = () => {
      keepScrollingButton.style.background = 'rgba(255, 255, 255, 0.05)';
      keepScrollingButton.style.color = '#ffffff';
    };
    keepScrollingButton.onmouseout = () => {
      keepScrollingButton.style.background = 'transparent';
      keepScrollingButton.style.color = '#8d8d8d';
    };

    // Add animations to document
    if (!document.getElementById('reply-guy-animations')) {
      const style = document.createElement('style');
      style.id = 'reply-guy-animations';
      style.textContent = `
        @keyframes replyGuyFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes replyGuyFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes replyGuyPopIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Assemble
    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(statsContainer);
    buttonContainer.appendChild(goBackButton);
    buttonContainer.appendChild(keepScrollingButton);
    content.appendChild(buttonContainer);
    popup.appendChild(content);
    backdrop.appendChild(popup);
    document.body.appendChild(backdrop);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Close function
    function closePopup() {
      backdrop.style.animation = 'replyGuyFadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
        document.body.style.overflow = '';
        popupShown = false;
      }, 300);
    }

    // Backdrop click
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closePopup();
    };

    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }


})();
