export default {

    computed: {

    },
	methods: {

        getAsana(token, url, cb, errorCb){

            if(token) {
                jQuery.ajax({
                    url: url,
                    async: false,
                    // beforeSend: function(xhr) {
                    //     xhr.setRequestHeader("Authorization", "Basic " + btoa("abc:123"));
                    // },
                    crossDomain: true,
                    type: 'GET',
                    headers: {
                        Authorization: "Bearer "+token
                    },
                    success: cb,
                    error: errorCb
                });
            }
        }

    },

}
