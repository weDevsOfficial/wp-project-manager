<script>
    
    import mixin from './../../helpers/mixin/mixin';
    
    function PMGetComponents() {
        var components = {};
        
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
        props: ['hook'],

        components: PMGetComponents(),

        render (h) {
            var components = [],
                self = this;
            
            weDevs_PM_Components.map(function(obj, key) {
                if (obj.hook == self.hook) {
                    components.push(h(obj.component));
                }
            });

            return h('span', {}, components);
        }
    }

    export default action;

</script>


