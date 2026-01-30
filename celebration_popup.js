(function () {
  let celebrationShown = false;

  // Listen for messages from service worker
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'SHOW_CELEBRATION') {
      if (!celebrationShown) {
        showCelebration(msg.milestone, msg.totalCount, msg.isQuota);
        celebrationShown = true;
        // Reset after 3 seconds to allow showing again if needed
        setTimeout(() => { celebrationShown = false; }, 3000);
      }
    }
  });

  function showCelebration(milestone, totalCount, isQuota = false) {

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'reply-guy-celebration-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(12px);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.4s ease-out;
    `;

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'reply-guy-celebration-popup';
    popup.style.cssText = `
      background: #1a1a1b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
      text-align: center;
      animation: modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    `;

    // Add confetti effect inside popup
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;

    // Generate confetti inside popup
    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement('div');
      const colors = ['#2eaadc', '#f7768e', '#9ece6a', '#bb9af7'];
      confetti.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${3 + Math.random() * 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: 0.6;
        border-radius: 50%;
      `;
      confettiContainer.appendChild(confetti);
    }
    popup.appendChild(confettiContainer);

    // Add FULLSCREEN confetti overlay
    const fullscreenConfetti = document.createElement('div');
    fullscreenConfetti.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      overflow: hidden;
      z-index: 2147483646;
    `;

    // Generate subtle fullscreen particles
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      const colors = ['#2eaadc', '#f7768e', '#9ece6a', '#bb9af7'];
      const size = 6 + Math.random() * 8;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -20px;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${4 + Math.random() * 4}s linear infinite;
        animation-delay: ${Math.random() * 3}s;
        opacity: ${0.2 + Math.random() * 0.3};
        border-radius: 50%;
      `;
      fullscreenConfetti.appendChild(particle);
    }
    backdrop.appendChild(fullscreenConfetti);

    // Create content
    emoji.textContent = '🦄';
    emoji.style.cssText = `
      font-size: 64px;
      margin-bottom: 16px;
      animation: floatEmoji 3s ease-in-out infinite;
      position: relative;
      z-index: 1;
    `;

    const title = document.createElement('h1');
    title.textContent = isQuota ? 'Quota Achieved' : 'Milestone Hit';
    title.style.cssText = `
      color: #fff;
      font-size: 24px;
      margin: 0 0 12px 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 700;
      letter-spacing: -0.5px;
      position: relative;
      z-index: 1;
    `;

    const milestone_text = document.createElement('p');
    if (isQuota) {
      milestone_text.innerHTML = `You've completed your <span style=\"color: var(--accent, #2eaadc); font-weight: 700; font-size: 36px;\">${milestone}</span> daily replies`;
    } else {
      milestone_text.innerHTML = `You've completed <span style=\"color: var(--accent, #2eaadc); font-weight: 700; font-size: 36px;\">${milestone}</span> replies`;
    }
    milestone_text.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 20px;
      margin: 0 0 24px 0;
      font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;
      line-height: 1.4;
      position: relative;
      z-index: 1;
    `;

    const message = document.createElement('p');
    const messages = {
      10: "You're just getting started! Keep it going!",
      50: "Half a hundred! You're on fire! 🔥",
      100: "Triple digits! You're a Reply Guy legend!",
      200: "Two hundred! Unstoppable force of nature!",
      500: "FIVE HUNDRED?! You're not human anymore!",
      1000: "ONE THOUSAND! You've transcended reality!"
    };

    if (isQuota) {
      message.textContent = "Great job! You've hit your daily quota. Keep the momentum going! 🎯";
    } else {
      message.textContent = messages[milestone] || "Incredible achievement! Keep crushing it!";
    }
    message.style.cssText = `
      color: #a9b1d6;
      font-size: 16px;
      margin: 0 0 40px 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-style: italic;
      position: relative;
      z-index: 1;
    `;

    // Share button
    const shareBtn = document.createElement('button');
    shareBtn.textContent = '🐦 Share on X';
    shareBtn.style.cssText = `
      background: linear-gradient(135deg, #2eaadc 0%, #1d9bc7 100%);
      color: white;
      border: none;
      padding: 18px 50px;
      font-size: 18px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(46, 170, 220, 0.4);
      margin-right: 15px;
      position: relative;
      z-index: 1;
    `;

    shareBtn.onmouseover = () => {
      shareBtn.style.background = 'linear-gradient(135deg, #3cc1f0 0%, #2eaadc 100%)';
      shareBtn.style.transform = 'scale(1.05) translateY(-2px)';
      shareBtn.style.boxShadow = '0 8px 25px rgba(46, 170, 220, 0.6)';
    };
    shareBtn.onmouseout = () => {
      shareBtn.style.background = 'linear-gradient(135deg, #2eaadc 0%, #1d9bc7 100%)';
      shareBtn.style.transform = 'scale(1)';
      shareBtn.style.boxShadow = '0 6px 20px rgba(46, 170, 220, 0.4)';
    };

    shareBtn.onclick = () => {
      const shareText = `I just finished ${milestone} replies today! 🎉 #ReplyGuy #XGrind`;
      const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(shareUrl, '_blank');
      closePopup();
    };

    // Dismiss button
    const dismissBtn = document.createElement('button');
    dismissBtn.textContent = 'Continue Grinding';
    dismissBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.1);
      color: #a9b1d6;
      border: 2px solid rgba(255, 255, 255, 0.2);
      padding: 18px 50px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    `;

    dismissBtn.onmouseover = () => {
      dismissBtn.style.background = 'rgba(255, 255, 255, 0.15)';
      dismissBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      dismissBtn.style.transform = 'scale(1.05)';
    };
    dismissBtn.onmouseout = () => {
      dismissBtn.style.background = 'rgba(255, 255, 255, 0.1)';
      dismissBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      dismissBtn.style.transform = 'scale(1)';
    };

    dismissBtn.onclick = closePopup;

    function closePopup() {
      backdrop.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
        document.body.style.overflow = '';
      }, 300);
    }

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    `;
    btnContainer.appendChild(shareBtn);
    btnContainer.appendChild(dismissBtn);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes modalSlideUp {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes floatEmoji {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes particleFloat {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Assemble popup
    popup.appendChild(emoji);
    popup.appendChild(title);
    popup.appendChild(milestone_text);
    popup.appendChild(message);
    popup.appendChild(btnContainer);
    backdrop.appendChild(popup);

    // Add to page
    document.body.appendChild(backdrop);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Auto-focus share button
    shareBtn.focus();

    // Allow ESC to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
})();
