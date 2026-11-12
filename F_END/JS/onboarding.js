/**
 * Daham Pasala Sadhu Charya - Role Selector & Onboarding Script (onboarding.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  const roleForm = document.getElementById('roleSelectForm');
  const roleCards = document.querySelectorAll('.role-card');
  const radioInputs = document.querySelectorAll('input[name="portalRole"]');
  const continueBtn = document.getElementById('continueBtn');
  let selectedTarget = 'Student.html';

  function selectRoleCard(card) {
    if (!card) return;
    roleCards.forEach(item => item.classList.remove('selected'));
    card.classList.add('selected');

    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
    }
    selectedTarget = card.dataset.target || (radio ? radio.value : selectedTarget);
    if (roleForm) {
      roleForm.setAttribute('action', selectedTarget);
    }
  }

  // Show subtle active session pills if any portal is already signed in
  const sessionMap = [
    { key: 'currentStudentRegNo', elId: 'session-badge-student' },
    { key: 'currentTeacherId', elId: 'session-badge-teacher' },
    { key: 'currentAdminId', elId: 'session-badge-admin' }
  ];
  sessionMap.forEach(({ key, elId }) => {
    const val = localStorage.getItem(key);
    const badgeEl = document.getElementById(elId);
    if (val && badgeEl) {
      badgeEl.textContent = `✓ සක්‍රීය සැසිය: ${val}`;
      badgeEl.style.display = 'inline-flex';
    }
  });

  // Read initial selection if present
  const checkedRadio = document.querySelector('input[name="portalRole"]:checked');
  const defaultSelected = checkedRadio
    ? checkedRadio.closest('.role-card')
    : document.querySelector('.role-card.selected');
  if (defaultSelected) {
    selectRoleCard(defaultSelected);
  }

  // Handle native radio state changes (keyboard arrow keys, space, label click)
  radioInputs.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        selectRoleCard(radio.closest('.role-card'));
      }
    });
  });

  // Handle card click and double-click shortcut
  roleCards.forEach((card) => {
    card.addEventListener('click', () => {
      selectRoleCard(card);
    });
    card.addEventListener('dblclick', () => {
      selectRoleCard(card);
      window.location.href = selectedTarget;
    });
  });

  // Handle form submission (Continue button or Enter key)
  if (roleForm) {
    roleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = selectedTarget;
    });
  } else if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      window.location.href = selectedTarget;
    });
  }
});

