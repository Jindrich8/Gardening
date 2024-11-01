
const dictOptions = {
    /**
   * The text used before any files are dropped.
   */
    dictDefaultMessage: "Přetáhněte sem obrázky, nebo klikněte.",

    /**
     * The text that replaces the default message text it the browser is not supported.
     */
    dictFallbackMessage:
        "Váš prohlížeč nepodporuje nahrávání pomocí přetahování souborů.",

    /**
     * The text that will be added before the fallback form.
     * If you provide a  fallback element yourself, or if this option is `null` this will
     * be ignored.
     */
    dictFallbackText:
        null,

    /**
     * If the filesize is too big.
     * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
     */
    dictFileTooBig:
        "Soubor je moc velký ({{filesize}}MiB). Maximální velikost: {{maxFilesize}}MiB.",

    /**
     * If the file doesn't match the file type.
     */
    dictInvalidFileType: "Tyto formáty souborů nejsou podporovány.",

    /**
     * If the server response was invalid.
     * `{{statusCode}}` will be replaced with the servers status code.
     */
    dictResponseError: "Sever vrátil chybu s kódem {{statusCode}}.",

    /**
     * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
     */
    dictCancelUpload: "Zruš nahrávání.",

    /**
     * The text that is displayed if an upload was manually canceled
     */
    dictUploadCanceled: "Nahrávání zrušeno.",

    /**
     * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
     */
    dictCancelUploadConfirmation: "Jsi si jistý, že cheš zrušit nahrávání tohoto souboru?",

    /**
     * If `addRemoveLinks` is true, the text to be used to remove a file.
     */
    dictRemoveFile: "Odebrat soubor",

    /**
     * If this is not null, then the user will be prompted before removing a file.
     */
    dictRemoveFileConfirmation: null,

    /**
     * Displayed if `maxFiles` is st and exceeded.
     * The string `{{maxFiles}}` will be replaced by the configuration value.
     */
    dictMaxFilesExceeded: "Nelze nahrát více souborů.",

}

const forms = document.querySelectorAll("form:has(.dropzone)");
for (const form of forms) {
    if (!(form instanceof HTMLFormElement)) continue;
    const dropZones = form.getElementsByClassName("dropzone");
    for (const dropZone of dropZones) {
        const options = {
            ...dictOptions,
            url: form.action, autoProcessQueue: false, autoQueue: false, addRemoveLinks: true,
        };
        const name = dropZone.dataset['data-name'];
        if (name != null && name.length > 0) {
            options.paramName = name;
        }
        const zone = new window.Dropzone(dropZone, options);

    }
}

