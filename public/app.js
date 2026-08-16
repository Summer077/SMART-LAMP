(() => {
  const statusEl = document.getElementById('connection');
  const statusRow = document.querySelector('.status-row');
  const ldrValueEl = document.getElementById('ldrValue');
  const ldrBarEl = document.getElementById('ldrBar');
  const ldrLabel = document.getElementById('ldrLabel');
  const ledStatus = document.getElementById('ledStatus');
  const deviceIpInput = document.getElementById('deviceIp');
  const connectBtn = document.getElementById('connectBtn');
  const espIconWrap = document.getElementById('espIconWrap');
  const ldrIconWrap = document.getElementById('ldrIconWrap');
  const ledIconWrap = document.getElementById('ledIconWrap');
  const lampIcon = document.querySelector('.lamp-icon');
  const modeButtons = document.querySelectorAll('.mode');
  const manualToggle = document.querySelector('.manual-toggle');
  const manualState = document.querySelector('.manual-state');

  if (!statusEl || !ldrValueEl || !ldrBarEl || !ldrLabel || !ledStatus || !deviceIpInput || !connectBtn || !espIconWrap || !ldrIconWrap || !ledIconWrap) {
    return;
  }

  const espConnectedSvg = `<svg class="tiny-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>`;
  const espDisconnectedSvg = `<svg class="tiny-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 12.55a11 11 0 0 1 5.29-2.93"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>`;
  const ldrOnSvg = `<svg class="tiny-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`;
  const ldrOffSvg = `<svg class="tiny-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`;
  const ledOnSvg = `<svg class="tiny-icon led-icon-svg on" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 0 8px rgba(251,191,36,0.9));"><path d="M13 2 3 14h7l-1 8 10-12h-8l1-8z" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const ledOffSvg = `<svg class="tiny-icon led-icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="12.41 6.75 13 2 10.57 4.92"/><polyline points="18.57 12.91 21 10 15.66 10"/><polyline points="8 8 3 14 12 14 11 22 16.85 15.85"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;
  const lampOffSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" style="color:#4a6080"><path d="M9 21h6M9 18h6M15.7 14.55A6 6 0 0 0 18 9a6 6 0 1 0-12 0c0 2.17 1.16 4.07 2.9 5.12L9 17h6l.7-2.45z" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"/></svg>`;
  const lampOnSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" style="color:#fbbf24; filter: drop-shadow(0 0 10px rgba(251,191,36,0.9));"><path d="M9 21h6M9 18h6M15.7 14.55A6 6 0 0 0 18 9a6 6 0 1 0-12 0c0 2.17 1.16 4.07 2.9 5.12L9 17h6l.7-2.45z" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"/></svg>`;
  const ldrDarkColor = '#5aa7ff';
  const ldrLightColor = '#fbbf24';

  let deviceUrl = localStorage.getItem('smartlamp-ip') || 'http://192.168.1.20';
  let pollTimer = null;
  let lastBoardLedState = null;
  let lastBoardDarkState = null;

  function parseBooleanValue(value, fallback = false) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['1', 'true', 'on', 'enabled', 'open', 'yes', 'light', 'day'].includes(normalized)) return true;
      if (['0', 'false', 'off', 'disabled', 'closed', 'no', 'dark', 'night'].includes(normalized)) return false;
      return normalized !== '' && normalized !== 'null' && normalized !== 'undefined';
    }
    return Boolean(value ?? fallback);
  }

  function setConnectionState(text, ok) {
    statusEl.textContent = text;
    statusEl.style.color = ok ? '#00efb5' : '#7d8ea5';
    espIconWrap.style.color = ok ? '#00efb5' : '#7d8ea5';
    espIconWrap.innerHTML = ok ? espConnectedSvg : espDisconnectedSvg;
    statusRow.classList.toggle('connected', ok);
    statusRow.classList.toggle('disconnected', !ok);
  }

  ldrIconWrap.innerHTML = ldrOffSvg;
  ledIconWrap.innerHTML = ledOffSvg;
  lampIcon.innerHTML = lampOffSvg;
  updateLampState(false);
  setConnectionState('DISCONNECTED', false);

  function updateLampState(isOn) {
    if (!lampIcon) return;
    if (!lampIcon.querySelector('svg')) {
      lampIcon.innerHTML = lampOffSvg;
    }
    const lampSvg = lampIcon.querySelector('svg');
    if (lampSvg) {
      lampSvg.classList.toggle('is-on', Boolean(isOn));
      lampSvg.classList.toggle('is-off', !isOn);
      lampSvg.style.color = isOn ? '#fbbf24' : '#4a6080';
      lampSvg.style.filter = isOn ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9))' : 'none';
    }
  }

  function updateIcons(lightOn, ledOn) {
    const ldrColor = lightOn ? ldrLightColor : ldrDarkColor;
    ldrIconWrap.style.color = ldrColor;
    ldrIconWrap.style.filter = 'none';
    if (!ldrIconWrap.querySelector('svg')) {
      ldrIconWrap.innerHTML = lightOn ? ldrOnSvg : ldrOffSvg;
    } else {
      const ldrSvg = ldrIconWrap.querySelector('svg');
      ldrSvg.setAttribute('stroke', ldrColor);
      ldrSvg.style.color = ldrColor;
    }
    ldrLabel.style.color = ldrColor;

    ledIconWrap.style.color = ledOn ? '#fbbf24' : '#8a97a7';
    if (!ledIconWrap.querySelector('svg')) {
      ledIconWrap.innerHTML = ledOn ? ledOnSvg : ledOffSvg;
    }
    const ledSvg = ledIconWrap.querySelector('svg');
    if (ledSvg) {
      ledSvg.classList.toggle('on', Boolean(ledOn));
      ledSvg.classList.toggle('is-off', !ledOn);
    }

    const ledBulb = document.querySelector('.led-bulb');
    if (ledBulb) {
      ledBulb.classList.toggle('on', Boolean(ledOn));
    }
    updateLampState(ledOn);
  }

  function updateLdr(raw, ledState, darkState, modeOverride = currentMode) {
    const isAutoMode = modeOverride === 'auto';
    const ledOn = Boolean(ledState);

    if (!isAutoMode) {
      ldrValueEl.textContent = '--';
      ldrBarEl.style.width = ledOn ? '100%' : '0%';
      ldrBarEl.style.background = ledOn ? 'linear-gradient(90deg, #f9cd3a, #ffbf00 45%, #ffc942 100%)' : 'linear-gradient(90deg, #5aa7ff, #7cb9ff 45%, #9ac8ff 100%)';
      ldrLabel.textContent = 'MANUAL';
      ldrLabel.style.color = ledOn ? ldrLightColor : ldrDarkColor;
      updateIcons(ledOn, ledOn);
      ledStatus.textContent = ledOn ? 'ON' : 'OFF';
      ledStatus.style.color = ledOn ? '#fbbf24' : '#7d8790';
      return;
    }

    const v = Number(raw || 0);
    ldrValueEl.textContent = v;

    const pct = Math.max(0, Math.min(1, v / 1023));
    ldrBarEl.style.width = (pct * 100) + '%';

    const lightOn = darkState === false;
    ldrLabel.textContent = lightOn ? 'LIGHT' : 'DARK';
    ldrBarEl.style.background = lightOn ? 'linear-gradient(90deg, #f9cd3a, #ffbf00 45%, #ffc942 100%)' : 'linear-gradient(90deg, #5aa7ff, #7cb9ff 45%, #9ac8ff 100%)';
    updateIcons(lightOn, ledOn);

    ledStatus.textContent = ledOn ? 'ON' : 'OFF';
    ledStatus.style.color = ledOn ? '#fbbf24' : '#7d8790';
  }

  async function fetchStatus() {
    const url = `${deviceUrl}/api/status`;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const boardLedState = parseBooleanValue(data.led ?? data.power ?? data.state ?? data.value ?? 0);
      const boardDarkState = parseBooleanValue(data.dark ?? data.light ?? data.mode ?? false);
      const isDark = boardDarkState === true || (typeof data.dark === 'string' && data.dark.toLowerCase() === 'dark');

      if (
        lastBoardLedState !== null &&
        lastBoardDarkState !== null &&
        boardLedState === lastBoardLedState &&
        isDark === lastBoardDarkState
      ) {
        setConnectionState('CONNECTED', true);
        return;
      }

      lastBoardLedState = boardLedState;
      lastBoardDarkState = isDark;
      setConnectionState('CONNECTED', true);

      if (currentMode === 'manual') {
        const now = Date.now();
        if (pendingManualState !== null && now - lastManualChangeAt < 2500) {
          setManualPowerState(pendingManualState);
          updateLdr(data.ldr ?? 0, pendingManualState, isDark, 'manual');
          return;
        }

        pendingManualState = null;
        manualPowerOn = boardLedState;
        setManualPowerState(manualPowerOn);
        updateLdr(data.ldr ?? 0, manualPowerOn, isDark, 'manual');
        return;
      }

      manualPowerOn = boardLedState;
      if (manualState) {
        manualState.textContent = 'LOCKED';
        manualState.style.color = 'rgba(164, 176, 188, 0.8)';
      }
      if (manualToggle) {
        manualToggle.classList.toggle('on', Boolean(boardLedState));
      }
      updateLdr(data.ldr ?? 0, boardLedState, isDark, 'auto');
    } catch (error) {
      setConnectionState('DISCONNECTED', false);
      console.error('ESP8266 fetch failed:', error);
    }
  }

  function startPolling() {
    clearInterval(pollTimer);
    fetchStatus();
    pollTimer = setInterval(fetchStatus, 1000);
  }

  let manualPowerOn = false;
  let currentMode = 'auto';
  let pendingManualState = null;
  let lastManualChangeAt = 0;

  function setManualPowerState(nextState) {
    manualPowerOn = nextState;
    if (!manualToggle || !manualState) return;
    manualToggle.classList.toggle('on', manualPowerOn);
    manualState.textContent = manualPowerOn ? 'ON' : 'OFF';
    manualState.style.color = manualPowerOn ? '#fbbf24' : '#5ee7d0';
  }

  async function sendModeCommand(mode) {
    const endpoint = mode === 'auto' ? '/api/auto' : '/api/manual';
    try {
      const response = await fetch(`${deviceUrl}${endpoint}`, {
        method: 'POST',
        cache: 'no-store'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async function sendManualPowerCommand(isOn) {
    const route = isOn ? '/api/led/on' : '/api/led/off';
    try {
      const response = await fetch(`${deviceUrl}${route}`, {
        method: 'POST',
        cache: 'no-store'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function setModeState(mode) {
    currentMode = mode;
    const manualCard = document.querySelector('.manual-card');

    if (manualCard) {
      manualCard.classList.toggle('auto', mode === 'auto');
      manualCard.classList.toggle('manual', mode === 'manual');
    }

    if (manualToggle) {
      manualToggle.disabled = mode !== 'manual';
      manualToggle.setAttribute('aria-disabled', String(mode !== 'manual'));
    }

    if (mode === 'auto') {
      if (manualToggle) {
        manualToggle.classList.toggle('on', Boolean(manualPowerOn));
      }
      if (manualState) {
        manualState.textContent = 'LOCKED';
        manualState.style.color = 'rgba(164, 176, 188, 0.8)';
      }
      updateLdr(Number(ldrValueEl.textContent || 0), manualPowerOn, true, 'auto');
      fetchStatus();
      return;
    }

    setManualPowerState(Boolean(manualPowerOn));
    updateLdr(Number(ldrValueEl.textContent || 0), manualPowerOn, !manualPowerOn, 'manual');
    fetchStatus();
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const mode = button.dataset.mode;
      modeButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      const serverModeChanged = await sendModeCommand(mode);
      if (!serverModeChanged) {
        console.warn('Mode command failed for the configured ESP URL:', deviceUrl);
      }
      setModeState(mode);
    });
  });

  if (manualToggle) {
    manualToggle.addEventListener('click', async () => {
      if (manualToggle.disabled) return;

      const nextState = !manualPowerOn;
      pendingManualState = nextState;
      lastManualChangeAt = Date.now();
      setManualPowerState(nextState);

      const modeChanged = await sendModeCommand('manual');
      if (!modeChanged) {
        console.warn('Manual mode switch failed for the configured device URL:', deviceUrl);
      }

      const sent = await sendManualPowerCommand(nextState);
      if (!sent) {
        pendingManualState = null;
        setManualPowerState(!nextState);
        console.warn('Manual LED command failed for the configured device URL:', deviceUrl);
        return;
      }

      manualPowerOn = nextState;
      updateLdr(Number(ldrValueEl.textContent || 0), manualPowerOn, !nextState, 'manual');
      setConnectionState('CONNECTED', true);
    });
  }

  currentMode = 'auto';
  deviceIpInput.value = deviceUrl;

  connectBtn.addEventListener('click', () => {
    deviceUrl = deviceIpInput.value.trim();
    if (!deviceUrl) {
      setConnectionState('DISCONNECTED', false);
      return;
    }
    localStorage.setItem('smartlamp-ip', deviceUrl);
    startPolling();
  });
})();
