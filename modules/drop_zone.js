
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

const previewTemplate = /*html*/`
<div class="dz-preview dz-image-preview"> 
    <div class="dz-image">
        <img data-dz-thumbnail alt="" src="" >
    </div> 
    <div class="dz-details"> 
        <div class="dz-size">
            <span data-dz-size="">
                <strong>0.2</strong> MB</span>
                </div> <div class="dz-filename">
                    <span data-dz-name="">bridge-53769_640.jpg</span>
                </div>
                 </div> 
                  <div class="dz-error-message">
                        <span data-dz-errormessage=""></span>
                        </div> <div class="dz-success-mark"> 
                            <svg width="54" height="54" fill="#fff">
                                <path d="m10.207 29.793 4.086-4.086a1 1 0 0 1 1.414 0l5.586 5.586a1 1 0 0 0 1.414 0l15.586-15.586a1 1 0 0 1 1.414 0l4.086 4.086a1 1 0 0 1 0 1.414L22.707 42.293a1 1 0 0 1-1.414 0L10.207 31.207a1 1 0 0 1 0-1.414Z"></path></svg> </div> <div class="dz-error-mark"> <svg width="54" height="54" fill="#fff"><path d="m26.293 20.293-7.086-7.086a1 1 0 0 0-1.414 0l-4.586 4.586a1 1 0 0 0 0 1.414l7.086 7.086a1 1 0 0 1 0 1.414l-7.086 7.086a1 1 0 0 0 0 1.414l4.586 4.586a1 1 0 0 0 1.414 0l7.086-7.086a1 1 0 0 1 1.414 0l7.086 7.086a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7.086-7.086a1 1 0 0 1 0-1.414l7.086-7.086a1 1 0 0 0 0-1.414l-4.586-4.586a1 1 0 0 0-1.414 0l-7.086 7.086a1 1 0 0 1-1.414 0Z"></path>
                                </svg> 
                                </div> 
                                </div>`;

const forms = document.querySelectorAll("form:has(.dropzone)");
for (const form of forms) {
    const zones = [];
    if (!(form instanceof HTMLFormElement)) continue;
    const dropZones = form.getElementsByClassName("dropzone");
    for (const dropZone of dropZones) {
        const options = {
            ...dictOptions,
            url: form.action, autoProcessQueue: false, autoQueue: false, addRemoveLinks: true,
            previewTemplate,
            uploadProgress: () => { }
        };
        const name = dropZone.dataset['data-name'];
        if (name != null && name.length > 0) {
            options.paramName = name;
        }
        const zone = new window.Dropzone(dropZone, options);
        zones.push(zone);
    }
    form.addEventListener('reset', () => {
        zones.forEach((zone) => zone.removeAllFiles());
    });
}

