window.applyKinetixTheme = function applyKinetixTheme(theme) {
  const isDark = theme === 'dark';
  const root = document.documentElement;
  const body = document.body;

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
    if (body) body.classList.add('dark');
  } else {
    root.removeAttribute('data-theme');
    root.classList.remove('dark');
    if (body) body.classList.remove('dark');
  }

  document.querySelectorAll('.theme-label').forEach((el) => {
    el.textContent = isDark ? 'Light' : 'Dark';
  });

  try {
    localStorage.setItem('kinetix-theme', isDark ? 'dark' : 'light');
  } catch (e) {}

  if (typeof window.syncKinetixThreeTheme === 'function') {
    window.syncKinetixThreeTheme(isDark);
  }
};

window.toggleKinetixTheme = function toggleKinetixTheme() {
  const currentlyDark =
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    (document.body && document.body.classList.contains('dark'));
  window.applyKinetixTheme(currentlyDark ? 'light' : 'dark');
};

document.addEventListener('DOMContentLoaded', () => {
  const initialDark = document.documentElement.getAttribute('data-theme') === 'dark';
  window.applyKinetixTheme(initialDark ? 'dark' : 'light');

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const menuIconOpen = document.getElementById('menuIconOpen');
  const menuIconClose = document.getElementById('menuIconClose');

  function setMobileMenu(open) {
    if (!mobileMenuBtn || !mobileMenuDrawer) return;
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuDrawer.classList.toggle('hidden', !open);
    menuIconOpen.classList.toggle('hidden', open);
    menuIconClose.classList.toggle('hidden', !open);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isOpen);
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => setMobileMenu(false));
  });

  const heroCaptureForm = document.getElementById('heroCaptureForm');
  const heroEmailInput = document.getElementById('heroEmailInput');
  const heroCaptureFeedback = document.getElementById('heroCaptureFeedback');
  const workEmailInput = document.getElementById('workEmail');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (heroCaptureForm) {
    heroCaptureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = heroEmailInput.value.trim();
      if (!val || !emailRegex.test(val)) {
        heroCaptureFeedback.textContent = 'Enter a valid work email address.';
        heroEmailInput.focus();
        return;
      }
      heroCaptureFeedback.textContent = '';
      if (workEmailInput) workEmailInput.value = val;
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const workflowData = {
    1: {
      file: '01_init_client.ts',
      metric: 'POST /v2/auth/verify • 200 OK',
      raw: `import { Kinetix } from '@kinetix-flow/sdk';

const kinetix = new Kinetix({
  apiKey: process.env.KINETIX_LIVE_KEY,
  environment: 'production'
});

const ping = await kinetix.ledger.verifyConnection();`,
      html: `<span class="tok-key">import</span> { Kinetix } <span class="tok-key">from</span> <span class="tok-str">'@kinetix-flow/sdk'</span>;

<span class="tok-key">const</span> kinetix = <span class="tok-key">new</span> Kinetix({
  apiKey: process.env.<span class="tok-str">KINETIX_LIVE_KEY</span>,
  environment: <span class="tok-str">'production'</span>
});

<span class="tok-key">const</span> ping = <span class="tok-key">await</span> kinetix.ledger.verifyConnection();`
    },
    2: {
      file: '02_split_payout.ts',
      metric: 'POST /v2/payouts/route • 12.8ms',
      raw: `const payout = await kinetix.payouts.create({
  idempotencyKey: 'ord_99481_us_eu',
  sourceAccount: 'acc_treasury_usd',
  amount: 250000,
  splits: [
    { destination: 'acct_merchant_de', share: 0.92, currency: 'EUR' },
    { destination: 'acct_platform_fee', share: 0.08, currency: 'USD' }
  ]
});`,
      html: `<span class="tok-key">const</span> payout = <span class="tok-key">await</span> kinetix.payouts.create({
  idempotencyKey: <span class="tok-str">'ord_99481_us_eu'</span>,
  sourceAccount: <span class="tok-str">'acc_treasury_usd'</span>,
  amount: <span class="tok-num">250000</span>,
  splits: [
    { destination: <span class="tok-str">'acct_merchant_de'</span>, share: <span class="tok-num">0.92</span>, currency: <span class="tok-str">'EUR'</span> },
    { destination: <span class="tok-str">'acct_platform_fee'</span>, share: <span class="tok-num">0.08</span>, currency: <span class="tok-str">'USD'</span> }
  ]
});`
    },
    3: {
      file: '03_webhook_reconcile.ts',
      metric: 'EVENT ledger.settled • HMAC-SHA256',
      raw: `app.post('/webhooks/kinetix', (req, res) => {
  const event = kinetix.webhooks.verify(
    req.rawBody,
    req.headers['x-kinetix-signature']
  );

  if (event.type === 'ledger.entry.settled') {
    await db.journal.markReconciled(event.data.journalId);
  }
  res.sendStatus(200);
});`,
      html: `app.post(<span class="tok-str">'/webhooks/kinetix'</span>, (req, res) => {
  <span class="tok-key">const</span> event = kinetix.webhooks.verify(
    req.rawBody,
    req.headers[<span class="tok-str">'x-kinetix-signature'</span>]
  );

  <span class="tok-key">if</span> (event.type === <span class="tok-str">'ledger.entry.settled'</span>) {
    <span class="tok-key">await</span> db.journal.markReconciled(event.data.journalId);
  }
  res.sendStatus(<span class="tok-num">200</span>);
});`
    }
  };

  let activeStep = 1;
  const codeFileName = document.getElementById('codeFileName');
  const codePreviewBlock = document.getElementById('codePreviewBlock');
  const codeStatusMetric = document.getElementById('codeStatusMetric');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  function renderWorkflowStep(stepNum) {
    activeStep = stepNum;
    const data = workflowData[stepNum];
    if (!data) return;

    document.querySelectorAll('.workflow-tab').forEach((tab) => {
      const isMatch = Number(tab.dataset.step) === stepNum;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', String(isMatch));
      const stepLabel = tab.querySelector('span.font-mono');
      if (stepLabel) {
        stepLabel.style.color = isMatch ? 'var(--accent)' : 'var(--ink-muted)';
      }
    });

    if (codeFileName) codeFileName.textContent = data.file;
    if (codePreviewBlock) codePreviewBlock.innerHTML = data.html;
    if (codeStatusMetric) codeStatusMetric.textContent = data.metric;
  }

  document.querySelectorAll('.workflow-tab').forEach((tab) => {
    tab.addEventListener('click', () => renderWorkflowStep(Number(tab.dataset.step)));
  });

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const rawCode = workflowData[activeStep].raw;
      if (navigator.clipboard) navigator.clipboard.writeText(rawCode);
      copyCodeBtn.textContent = 'Copied';
      setTimeout(() => {
        copyCodeBtn.textContent = 'Copy';
      }, 1500);
    });
  }

  renderWorkflowStep(1);

  const billingMonthlyBtn = document.getElementById('billingMonthlyBtn');
  const billingAnnualBtn = document.getElementById('billingAnnualBtn');
  const selectedPlanSelect = document.getElementById('selectedPlan');

  function setBillingCycle(cycle) {
    const isAnnual = cycle === 'annual';
    billingMonthlyBtn.classList.toggle('bg-[var(--accent)]', !isAnnual);
    billingMonthlyBtn.classList.toggle('text-white', !isAnnual);
    billingMonthlyBtn.classList.toggle('text-[var(--ink-secondary)]', isAnnual);

    billingAnnualBtn.classList.toggle('bg-[var(--accent)]', isAnnual);
    billingAnnualBtn.classList.toggle('text-white', isAnnual);
    billingAnnualBtn.classList.toggle('text-[var(--ink-secondary)]', !isAnnual);

    document.querySelectorAll('.price-figure').forEach((el) => {
      el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
  }

  if (billingMonthlyBtn && billingAnnualBtn) {
    billingMonthlyBtn.addEventListener('click', () => setBillingCycle('monthly'));
    billingAnnualBtn.addEventListener('click', () => setBillingCycle('annual'));
  }

  document.querySelectorAll('.select-plan-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const planName = btn.dataset.selectPlan;
      if (selectedPlanSelect && planName) {
        selectedPlanSelect.value = planName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const demoRequestForm = document.getElementById('demoRequestForm');
  const demoConfirmationState = document.getElementById('demoConfirmationState');
  const confirmationSummary = document.getElementById('confirmationSummary');
  const resetDemoFormBtn = document.getElementById('resetDemoFormBtn');

  function setFieldError(inputEl, errorEl, msg) {
    if (errorEl) errorEl.textContent = msg;
    if (inputEl) {
      inputEl.style.borderColor = msg ? 'var(--status-live)' : 'var(--border-line)';
    }
  }

  if (demoRequestForm) {
    demoRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName');
      const workEmail = document.getElementById('workEmail');
      const companySize = document.getElementById('companySize');
      const selectedPlan = document.getElementById('selectedPlan');
      const projectMessage = document.getElementById('projectMessage');

      let valid = true;

      if (!fullName.value.trim()) {
        setFieldError(fullName, document.getElementById('errorFullName'), 'Full name is required.');
        valid = false;
      } else {
        setFieldError(fullName, document.getElementById('errorFullName'), '');
      }

      if (!workEmail.value.trim() || !emailRegex.test(workEmail.value.trim())) {
        setFieldError(workEmail, document.getElementById('errorWorkEmail'), 'Valid work email is required.');
        valid = false;
      } else {
        setFieldError(workEmail, document.getElementById('errorWorkEmail'), '');
      }

      if (!companySize.value) {
        setFieldError(companySize, document.getElementById('errorCompanySize'), 'Select your team size.');
        valid = false;
      } else {
        setFieldError(companySize, document.getElementById('errorCompanySize'), '');
      }

      if (!projectMessage.value.trim()) {
        setFieldError(projectMessage, document.getElementById('errorProjectMessage'), 'Please describe your use case.');
        valid = false;
      } else {
        setFieldError(projectMessage, document.getElementById('errorProjectMessage'), '');
      }

      if (!valid) return;

      confirmationSummary.textContent = `We've sent sandbox credentials and a calendar invite for the ${selectedPlan.value} plan to${workEmail.value.trim()}.`;
      demoRequestForm.classList.add('hidden');
      demoConfirmationState.classList.remove('hidden');
    });
  }

  if (resetDemoFormBtn) {
    resetDemoFormBtn.addEventListener('click', () => {
      demoRequestForm.reset();
      demoConfirmationState.classList.add('hidden');
      demoRequestForm.classList.remove('hidden');
    });
  }
});