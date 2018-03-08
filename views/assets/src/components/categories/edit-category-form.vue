<template>
    <div class="form-wrap">
        <form action="" @submit.prevent="updateSelfCategory()">
            <fieldset>
                <legend class="inline-edit-legend">{{text.quick_edit}}</legend>
                <div class="inline-edit-col">
                <label>
                    <span class="title">{{text.name}}</span>
                    <span class="input-text-wrap">
                        <input v-model="category.title" type="text" name="name" class="ptitle" value="">
                    </span>
                </label>
                    <label>
                    <span class="title">{{text.description}}</span>
                    <span class="input-text-wrap">
                        <textarea v-model="category.description"></textarea>
                    </span>
                </label>
                </div>
            </fieldset>

            <p class="inline-edit-save submit">
                <button @click.prevent="showHideCategoryEditForm(category)" type="button" class="cancel button alignleft">{{text.cancel}}</button>
                <input type="submit" class="save button button-primary alignright" :value="text.update_category">
                <span v-show="show_spinner" class="pm-spinner"></span>
                <br class="clear">
            </p>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['category'],
        mixins: [PmMixin.projectCategories],
        data () {
            return {
                submit_disabled: false,
                show_spinner:false,
            }
        },
        methods: {
            updateSelfCategory () {
                // Exit from this function, If submit button disabled 
                if ( this.submit_disabled ) {
                    return;
                }
                
                // Disable submit button for preventing multiple click
                this.submit_disabled = true;
                this.show_spinner = true;

                        var args= {
                                data: {
                                id: this.category.id,
                                title: this.category.title,
                                description: this.category.description
                            }
                        }

                        this.updateCategory(args);
            }
        }
    }
</script>