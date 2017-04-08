Vue.component('text-editor', {
    template: '<textarea id="vue-text-editor-gggg" class="vue-text-editor">{{ content }}</textarea>',

    props: ['content', 'tinymceSettings'],

    data: function () {
        return {
            editorId: 'test'
        };
    },


    computed: {
        shortcodes: function () {
            return this.tinymceSettings.shortcodes;
        },

        pluginURL: function () {
            return this.tinymceSettings.pluginURL;
        }
    },

    created: function () {

        var component = this;

        window.tinymce.init({
            selector: 'textarea#vue-text-editor-' + this.editorId,
            height: 300,
            menubar: false,
            convert_urls: false,
            theme: 'modern',
            skin: 'lightgray',
            content_css: component.pluginURL + '/assets/css/text-editor.css',
            setup: function (editor) {

                var menuItems = [];
                $.each(component.shortcodes, function (ShortcodeType) {
                    menuItems.push({
                        text: this.title,
                        classes: 'menu-section-title'
                    });

                    $.each(this.codes, function (shortcode) {
                        var shortcodeDetails = this;

                        menuItems.push({
                            text: this.title,
                            onclick: function () {
                                var code = '[' + ShortcodeType + ':' + shortcode + ']';

                                if (shortcodeDetails.default) {
                                    code = '[' + ShortcodeType + ':' + shortcode + ' default="' + shortcodeDetails.default + '"]';
                                }

                                if (shortcodeDetails.text) {
                                    code = '[' + ShortcodeType + ':' + shortcode + ' text="' + shortcodeDetails.text + '"]';
                                }

                                if (shortcodeDetails.plain_text && shortcodeDetails.text) {
                                    code = shortcodeDetails.text;
                                }

                                editor.insertContent(code);
                            }
                        });
                    });
                });

                editor.addButton('shortcodes', {
                    type: 'menubutton',
                    icon: 'shortcode',
                    tooltip: 'Shortcodes',
                    menu: menuItems
                });

                // editor change triggers
                editor.on('change', function () {
                    component.$set('content', editor.getContent());
                });
                editor.on('keyup', function () {
                    component.$set('content', editor.getContent());
                });
                editor.on('NodeChange', function () {
                    component.$set('content', editor.getContent());
                });
            },
            fontsize_formats: '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px',
            font_formats : 'Arial=arial,helvetica,sans-serif;'+
                'Comic Sans MS=comic sans ms,sans-serif;'+
                'Courier New=courier new,courier;'+
                'Georgia=georgia,palatino;'+
                'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;'+
                'Tahoma=tahoma,arial,helvetica,sans-serif;'+
                'Times New Roman=times new roman,times;'+
                'Trebuchet MS=trebuchet ms,geneva;'+
                'Verdana=verdana,geneva;',
            plugins: 'textcolor colorpicker wplink wordpress code hr',
            toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
            toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
            toolbar3: 'fontselect fontsizeselect removeformat undo redo',
        });
    }
});
