import general_file from './general.vue';
import email_file from './email.vue';

var general = { 
    path: '/settings', 
    components: { 'general': general_file }, 
    name: 'general',
}

var email = { 
    path: '/settings/email', 
    components: { 'email': email_file }, 
    name: 'email',
}

export {general, email};



