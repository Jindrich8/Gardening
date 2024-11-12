document.querySelectorAll('form.no-action').forEach(f => {
    f.addEventListener('submit', (e) => {
        const btns = f.querySelectorAll('input:is([type="submit"],[type="reset"]),button:not([type="button"]');
        for (const btn of btns) {
            btn.disabled = true.toString();
        }
        e.preventDefault();
        
        return false;
    });
});