//import project_lists from './index.vue';

const discussions_route = resolve => {
    require.ensure(['./discussions.vue'], () => {
        resolve(require('./discussions.vue'));
    });
}

const individual_discussion = resolve => {
    require.ensure(['./individual-discussions.vue'], () => {
        resolve(require('./individual-discussions.vue'));
    });
}

var discussions = {
    path: '/:project_id/discussions/', 
    components: { 
        'discussions': discussions_route 
    }, 
    name: 'discussions',
}

var single_discussion = { 
    path: '/:project_id/single-discussion/:discussion_id', 
    components: { 
        'individual-discussions': individual_discussion
    }, 
    name: 'individual_discussions' 
}

export { discussions, single_discussion };

 