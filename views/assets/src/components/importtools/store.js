export default {
	state: {
        getIndex: function ( itemList, id, slug) {
            var index = false;

            if(typeof itemList === 'undefined') return index;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
    },

    mutations: {

    },
}
