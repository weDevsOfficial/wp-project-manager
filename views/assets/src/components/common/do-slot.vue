

<script>
    import Fragment from 'vue-fragment'
    import mixin from './../../helpers/mixin/mixin';
    
    function PMGetComponents() {
        var components = {};

        components['fragment'] = Fragment.Fragment;
        
        weDevs_PM_Components.map(function(obj, key) {
            if (obj.property.mixins) {
                obj.property.mixins.push(mixin);
            } else {
                obj.property.mixins = [mixin];
            }

            components[obj.component] = obj.property;
        });

        return components;
    }

    var action = {
        props: {
            hook: {
                type: String,
                required: true
            },

            actionData: {
                type: [Object, Array, String, Number],

                default: function () {
                    return {}
                }
            }
        },

        components: PMGetComponents(),

        render (h) {
            this.$options.components = PMGetComponents();

            var components = [],
                self = this;

            weDevs_PM_Components.map(function(obj, key) {
                if (obj.hook == self.hook) {
                    components.push(
                       Vue.compile('<'+obj.component+' :actionData="actionData"></'+obj.component+'>').render.call(self)
                    );
                }
            });

            return h( 'fragment', {}, components );
        }
    }

    export default action;
    
</script>

