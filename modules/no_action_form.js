document.querySelectorAll('form.no-action').forEach(f => {
    f.addEventListener('submit', (e) => {
        const btns = f.querySelectorAll('input:is([type="submit"],[type="reset"]),button:not([type="button"]');
        const disableControls = (disable) => {
            for (const btn of btns) {
                btn.disabled = disable;
            }
        };
        disableControls(true);
        e.preventDefault();

        const alertId = f.dataset['jsAlertId'];
        const alert = alertId != null && document.getElementById(alertId);

        if (alert != null) {
            const closeBtn = alert.querySelector('.js-close-btn');
            const message = alert.querySelector('.js-message');
            if (closeBtn != null && message != null) {
                alert.classList.add('hidden');
                let loading = undefined;
                const loadingId = f.dataset['jsLoadingId'];
                if (loadingId != null) {
                    loading = document.getElementById(loadingId);
                    if (loading != null) {
                        loading.classList.remove('hidden');

                    }
                }
                f.ariaBusy = true;
                setTimeout(() => {
                    if (loading != null) {
                        loading.classList.add('hidden');
                    }
                    f.ariaBusy = false;
                    alert.classList.remove('hidden');
                    message.textContent = "Zpráva byla úspěšně odeslána.";
                    disableControls(false);
                    f.querySelector('input[type="reset"]')?.click();
                    closeBtn.addEventListener('click', () => {
                        alert.classList.add('hidden');
                    }, {
                        once: true,
                        capture: false
                    });
                }, 3000);
            }

        }
        return false;
    });
});