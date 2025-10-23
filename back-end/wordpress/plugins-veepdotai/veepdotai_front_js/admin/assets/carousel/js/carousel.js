// Constant used to switch beteween the static mode for testing purposes and the dynamic mode
const staticMode = false;

/**
 * Constant used to define which html element will trigger the widget.
 * possible values :
 *  "SPAN" (refers to the span that cover the featured image in a WP post)
 *  "IMG" (default value, the featured image itself)
 */
const CLICK_ELEMENT = "";

const VeepdotaiCarousel = {

    /**
     * This function create the carousel widget on every element of the widget class
     * @param {Array} images 
     * @param {int} nbImages 
     */
    initSplide: function(images, nbImages){
        const widgets = document.getElementsByClassName("widget");
        let id = "";
        let carousel = "";
        
        for (let i=0; i<widgets.length; i++) {
            id = this.randomId();
            widgets[i].id = "widget-" + id;
            carousel = this.createHTMLCarousel(id, nbImages);

            $("#widget-" + id).append(carousel);

            this.fillSplide(id, nbImages, images);

            $(".widget img:first").hide();

            new Splide('#splide-'+id, {rewind: true}).mount();
        }
    },

    /**
     * This function create the html structure of a carousel as a string
     * @param {string} id 
     * @param {int} nbImages 
     * @returns {string}
     */
    createHTMLCarousel: function(id, nbImages){
        let str =
        `<div id="splide-${id}" class="splide" aria-label="Splide Basic HTML Example">
                <div class="splide__track">
                    <div class="splide__list">`;

        for (let i=0; i<nbImages; i++) {
            str +=     `<div class="splide__slide">
                            <img class="splide__image" src="">
                        </div>`;
        }
                
        str +=     `</div>
                </div>
            </div>`
        ;
        
        return str;
    },

    /**
     * This function return a random generated id
     * @returns {string}
     */
    randomId: function(){
        return Math.floor((1 + Math.random())* 0x10000)
            .toString(16)
            .substring(1);
    },

    /**
     * This function return an array containing all the objects extracted from a string in json format
     * @param {string} json 
     * @returns {Array} 
     */
    extractImages: function(json){
        let images = JSON.parse(json);
        return images;
    },

    /**
     * This function fill the carousel with images
     * @param {String} id : the carousel unique id
     * @param {Integer} nbImages : number of images that the carousel can display
     * @param {Object[]} images : images to display
     */
    fillSplide: function(id, nbImages, images) {
        for (let i=0; i<nbImages; i++) {
            $("#splide-"+id + " img")[i].src = images[i].media;
        }
        this.createButtons();
    },

    /**
     * Fonction qui fabrique la structure HTML du formulaire en chaîne de caracteres
     * This function create the html structure of the form to search images
     * @param {string} defaultQuery
     * @returns {string} the html structure as a string
     */
    formStr: function(defaultQuery){
        let str = `
            <div id="myModal">
                <div class="modal-header">
                    <h4 class="modal-title">Sélection d'image</h4>
                </div>
                <div class="modal-body">
                    <form id="carousel-form" method="post">
                        
                        <input id="query" type="text" name="recherche" class="max-size form-text" value="${defaultQuery} placeholder="Mots clés ...">
                        
                        <div class="form-radios">
                            <input id="api-pex" type="radio" name="api" value="pexels">
                            <label for="api-pex">Pexels</label><br>
                            <input id="api-unsp" type="radio" name="api" value="unsplash">
                            <label for="api-unsp">Unsplash</label><br>
                            <input id="api-both" type="radio" name="api" value="both" checked>
                            <label for="api-both">Both</label><br>
                        </div>

                        <p id='form-error'></p>

                        <button type="submit" class="carousel-btn color-pr max-size"></button>
                    </form>
                <div>
            </div>
        `;
        return str;
    },

    /**
     * This function create the html structure of the validation/annulation buttons and add it to the page
     */
    createButtons: function(){
        const str = `
            <div id="boutons">
                <button id="validation" class="carousel-btn color-pr">Valider</button>

                <button id="annulation" class="carousel-btn color-sc">Annuler</button>
            </div>
        `; 
        $(".splide__track").append(str);
    },

    initWidget: function(){
        $(".widget").append(this.formStr(""));
        $("#myModal").hide();
    },

    initClick: function(){
        $(".widget " + ( CLICK_ELEMENT || "IMG" )).click(function(){
            let id = VeepdotaiCarousel.randomId();
            let queryImage;

            switch(CLICK_ELEMENT) {
                default:
                case "IMG":
                    $(this).attr("id","img-" + id);
                    queryImage = document.getElementById("img-"+id).alt;
                break;

                case "SPAN":
                    $(this).siblings("img").attr("id","img-" + id);
                    queryImage = $(this).siblings("img").attr("alt");
                break;
            }
            
            document.getElementById("query").value = queryImage;

            $("#myModal").modal({
                clickClose: true,
                showClose: false
            });

            $("#form-error").hide();

            $("form button").html("Lancer recherche");
            $("form button").attr("disabled", false);
        });
    },

    initForm: function(){
        $("#carousel-form").submit(function(event){
            event.preventDefault();
    
            $(".widget .splide").remove();
    
            const query = document.getElementById("query").value;
            
            const radios = document.getElementsByName("api");
            let api = "";
            for (let i=0; i<radios.length; i++){
                if (radios[i].checked) {
                    api = radios[i].value;
                }
            }
            if (query === "") {
                $("#form-error").text("Des mots clés sont nécessaires pour la recherche");
                $("#form-error").show("slow");

            }else {
                $("form button").attr("disabled", true);
                $("form button").html(`<span class="loader"></span> Recherche`);
                VeepdotaiCarousel.initUnloadListeners();

                if (staticMode) {
                    //$("#debug").text("STATIC MODE - request: Paysage");
                    console.log("STATIC MODE - request: Paysage");
                    
                    let json;
                    switch(api){
                        case "pexels":
                            json = staticJsonPexels;
                            break;
                        case "unsplash":
                            json = staticJsonUnsplash;
                            break;
                        case "both":
                            json = staticJson;
                            break;
                    }
                    VeepdotaiCarousel.processJson(json);
                
                }else {
                    $("#form-error").hide();
                    ajax_get_json_api(query, api);
                }
            }
        });
    },

    /**
     * 
     * @param {string} json 
     */
    processJson: function(json){

        //$("#debug").text(json);
        let photos = VeepdotaiCarousel.extractImages(json);

        if (photos.length == 0) {
            $("#form-error").text("La requête aux banques d'images a échoué");
            $("#form-error").show("slow");

            $("form button").text("Lancer recherche");
            $("form button").attr("disabled", false);
        }else {
            $.modal.close();
            VeepdotaiCarousel.initSplide(photos, photos.length);

            $("#annulation").click(function(){
                $(".widget .splide").remove();
                $(".widget img:first").show();
                VeepdotaiCarousel.stopUnloadListeners();
            });

            $("#validation").click(function(){
                let url = $(".is-active").children("img").attr("src");
                let query = document.getElementById("query").value;
                $(".widget img:first").attr("src",url);
                $(".widget img:first").attr("srcset", url + " 2048w");
                $(".widget img:first").attr("alt", query);
                $(".widget .splide").remove();
                $(".widget img:first").show();

                let postId = VeepdotaiCarousel.getPostId();

                ajax_save_featured_image(url, query, postId);
            });
        }
    },

    getPostId: function(){
        let str = $("body").attr("class");
        let num = str.search("postid-");
        
        str = str.slice(num+7);
        num = str.search(" ");
        
        str = str.slice(0, num);
        num = parseInt(str);

        return num;
    },

    getLoadingModal: function(){
        let modal = 
            `<div id="loading-modal">
                <p><b>Enregistrement de l'image</b></p>
                <p><b>Ne pas recharger la page</b></p>
                <p><b>...</b></p>
            </div>`
        ;
        return modal;
    },

    initUnloadListeners: function() {
        window.addEventListener('beforeunload', this.handleUnloadEvents);
        window.addEventListener('pagehide', this.handleUnloadEvents);
    },

	handleUnloadEvents: function(e) {
		window.prompt("Are you really sure you want to quit the application?");
        e.preventDefault();
	},

	stopUnloadListeners: function() {
		window.removeEventListener('beforeunload', this.handleUnloadEvents);
		window.removeEventListener('pagehide', this.handleUnloadEvents);
	},

    widget: function(){
        this.initWidget();
        
        this.initClick();
        
        this.initForm();
    }
}

$(document).ready(function(){
    if ($("body").attr("class").includes("logged-in")){
        VeepdotaiCarousel.widget();
    }else{
        $(".widget " + ( CLICK_ELEMENT || "IMG" )).css("cursor","auto");
    }
});

/*  *******************************************************************************************************************************************
 *  Ajax functions :
 *  *******************************************************************************************************************************************
 */ 

function ajax_save_featured_image(src, alt, postId){

    $("body").append(VeepdotaiCarousel.getLoadingModal());
    $("#loading-modal").hide();
    $("#loading-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
    });

    let isUnsplash = !(src.match('unsplash') === null);

    let fd = new FormData();

    fd.append( 'src', src );
    fd.append( 'alt', alt );
    fd.append( 'postId', postId );
    fd.append( 'isUnsplash', isUnsplash );

    fd.append( 'action', 'save_featured_image' );
    fd.append( 'security', MyAjax.security );

    jQuery.ajax(
        {
            url: MyAjax.ajaxurl,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function ( response ) {
                VeepdotaiCarousel.stopUnloadListeners();
                $.modal.close();

                /*console.log(response);
                if (parseInt(response)){
                    console.log("Image déjà enregistrée");
                }else{
                    console.log("Nouvelle image enregistrée");
                }*/
            }
        }
    );
}

function ajax_get_json_api(query, api){
    let fd = new FormData();

    fd.append('query', query);
    fd.append('api', api);

    fd.append( 'action', 'get_json_api' );
    fd.append( 'security', MyAjax.security );

    jQuery.ajax(
        {
            url: MyAjax.ajaxurl,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function ( response ) {
                //console.log( "reponse: " + response );
                VeepdotaiCarousel.processJson(response);
            }
        }
    );
}