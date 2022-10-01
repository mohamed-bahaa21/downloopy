var html_content = {
    mixed: `<form action="/url_parser" method="post">
        <div class="form-item">
            <label for="FILES_NUMBER">Files Number</label>
            <input type="number" name="FILES_NUMBER" id="FILES_NUMBER"><br>
        </div>

        <div class="form-item">
            <label for="url">URL</label>
            <input type="text" name="url" id="url" />
        </div>

        <input type="text" name="DTYPE" value="mixed" hidden>

        <button class="overlay__btn overlay__btn--colors" style="margin: 0 auto !important;">
            <input type="submit" value="Submit">
            <span class="overlay__btn-emoji"></span>
        </button>
        </form>`,

    selective: `
        <form action="/url_parser" method="post">
            <!-- 
            <div class="form-item">
                <label for="website">Choose a website:</label>
                <select name="website" id="website">
                    <option value="Google-Drive">Google-Drive</option>
                    <option value="QNL">QNL</option>
                    <option value="Slideshare">Slideshare</option>
                    <option value="archive.alsharekh">archive.alsharekh</option>
                    <option value="dar.bibalex">dar.bibalex</option>
                    <option value="yunong.io">yunong.io</option>
                    <option value="InfoQ">InfoQ</option>
                </select>    
            </div>

            <div class="form-item">
                <label for="website">File Type:</label>
                <select name="FILE_TYPE" id="FILE_TYPE">
                    <option value="jpg">jpg</option>
                    <option value="pdf">pdf</option>
                </select>
                
            </div>

            <div class="form-item">
                <label for="FOLDER_NAME">Folder Name</label>
                <input type="text" name="FOLDER_NAME" id="FOLDER_NAME">
            </div>

            <div class="form-item">
                <label for="FOLDER_NAME">File Name</label>
                <input type="text" name="FILE_NAME" id="FILE_NAME">
            </div>

            <div class="form-item">
                <label for="URI_START">URI_START</label>
                <input type="text" name="URI_START" id="URI_START">
            </div>

            <div class="form-item">
                <label for="URI_END">URI_END</label>
                <input type="text" name="URI_END" id="URI_END">
            </div>
            -->

            <div class="form-item">
                <label for="PAGES">Pages: </label>
                <span id="selected_pages"></span>

                <div style="display: flex">
                    <input type="number" name="PAGES" id="pages_input">
                    <input type="text" name="pages_arr" id="pages_arr" />

                    <span id="add_page_btn" class="overlay__btn overlay__btn--colors" 
                    style="margin: 0 auto !important;
                    width: fit-content !important;
                    position: relative;
                    left: -2.5rem;
                    bottom: -0.12rem;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    font-size: 0.75em;
                    padding: 0rem 0.6rem;
                    scale: 1.075;">
                        Add
                    </span>
                </div>
            </div>

            <div class="form-item">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" />
            </div>

            <input type="text" name="DTYPE" value="selective" hidden>

            <button class="overlay__btn overlay__btn--colors" style="margin: 0 auto !important;">
                <input type="submit" value="Submit">
                <span class="overlay__btn-emoji"></span>
            </button>
        </form>`
}
