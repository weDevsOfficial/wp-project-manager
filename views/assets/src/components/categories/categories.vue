<template>
    <div class="wrap nosubsub">
        <h1 class="wp-heading-inline">{{ __( 'Categories', 'wedevs-project-manager') }}</h1>
        <hr class="wp-header-end">
        <div v-if="!isFetchCategories" class="pm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>

        <div v-if="isFetchCategories" id="col-container" class="wp-clearfix">

            <div id="col-left">
                <div class="col-wrap">

                    <div class="form-wrap">
                        <h2>{{ __( 'Add New Category', 'wedevs-project-manager') }}</h2>
                        <form @submit.prevent="categoryFormAction()" id="addtag" method="post" action="edit-tags.php" class="validate" >
                            
                            <div class="form-field form-required term-name-wrap">
                                <label for="tag-name">{{ __( 'Name', 'wedevs-project-manager') }}</label>
                                <input v-model="title" required="required" name="tag-name" id="tag-name" type="text" value="" size="40" aria-required="true">
                                <p></p>
                            </div>

                            <div class="form-field term-description-wrap">
                                <label for="tag-description">{{ __( 'Description', 'wedevs-project-manager') }}</label>
                                <textarea v-model="description" name="description" id="tag-description" rows="5" cols="40"></textarea>
                                <p></p>
                            </div>

                            <p class="submit">
                                <input type="submit" name="submit" id="submit" class="button button-primary" :value="add_new_category">
                                <span v-show="show_spinner" class="pm-spinner"></span>
                            </p>
                        </form>
                    </div>

                </div>
            </div><!-- /col-left -->

            <div id="col-right">
                <div class="col-wrap">
                    <form @submit.prevent="selfDeleted()" id="posts-filter" method="post">
                    
                        <div class="tablenav top">
                            <div class="alignleft actions bulkactions">
                                <label for="bulk-action-selector-top" class="screen-reader-text">{{ __( 'Select bulk action', 'wedevs-project-manager') }}</label>
                                <select id="bulk-action-selector-top"  v-model="bulk_action" name="action">
                                    <option value="-1">{{ __( 'Bulk Actions', 'wedevs-project-manager') }}</option>
                                    <option value="delete">{{ __( 'Delete', 'wedevs-project-manager') }}</option>
                                </select>
                                <input type="submit" id="doaction" class="button action" :value="__( 'Apply', 'wedevs-project-manager')">
                            </div>
                            <pm-pagination 
                                :total_pages="total_category_page" 
                                :current_page_number="current_page_number" 
                                component_name='category_pagination'>
                                
                            </pm-pagination>
                            
                            <br class="clear">
                        </div>
                        
                        <table class="wp-list-table widefat fixed striped tags">
                            <thead>
                                <tr>
                                    <td id="cb" class="manage-column column-cb check-column">
                                        <label class="screen-reader-text" for="cb-select-all-1">{{ __( 'Select all', 'wedevs-project-manager') }}</label>
                                        <input @change="selectAll()" v-model="select_all"   id="cb-select-all-1" type="checkbox">
                                    </td>
                                    <th scope="col" id="name" class="manage-column column-name column-primary sortable desc">
                                        <a href="#">
                                            <span>{{__( 'Name', 'wedevs-project-manager')}}</span>
                                        </a>
                                    </th>
                                    <th scope="col" id="description" class="manage-column column-description sortable desc">
                                        <a href="">
                                            <span>{{ __( 'Description', 'wedevs-project-manager') }}</span>
                                        </a>
                                    </th>
                                    <!-- <th scope="col" id="description" class="manage-column column-description sortable desc">
                                        <a href="">
                                            <span>Type</span>
                                        </a>
                                    </th> -->
                                </tr>
                            </thead>

                            
                            <tbody id="the-list" data-wp-lists="list:tag">

                                <tr id="tag-1" v-for="category in categories" key="category.id" :class="catTrClass(category)" :key="category.id">
                                    <th v-if="!category.edit_mode" scope="row" class="check-column">
                                        <input v-model="delete_items" :value="category.id" type="checkbox"  id="cb-select-48">
                                    </th>
                                    <td v-if="!category.edit_mode" class="name column-name has-row-actions column-primary" data-colname="Name">
                                        <strong>
                                            <a class="row-title" :href="'#/projects/active?category='+category.id">{{ category.title }}</a>
                                        </strong>
                                    
                                        <div class="row-actions">
                                            <span class="edit">
                                                <a @click.prevent="showHideCategoryEditForm(category)" href="#">{{ __('Edit', 'wedevs-project-manager')}}</a> | 
                                                <a @click.prevent="selfDeleteCategory(category)" href="#">{{ __('Delete', 'wedevs-project-manager')}}</a> 
                                            </span>
                                        </div>
                                        
                                    </td>
                                    <td v-if="!category.edit_mode" class="description column-description" data-colname="Description">{{ category.description }}</td>
                                    <!-- <td v-if="!category.edit_mode" class="description column-description" data-colname="Description">{{ category.categorible_type }}</td> -->

                                    <td v-if="category.edit_mode" colspan="3">
                                        <edit-category-form :category="category"></edit-category-form>
                                    </td>
                                </tr>   
                                <tr v-if="!categories.length" class="no-items">
                                    <td class="colspanchange" colspan="3">No categories found.</td>
                                </tr>
                            </tbody>


                            <tfoot>
                                <tr>
                                    <td class="manage-column column-cb check-column">
                                        <input @change="selectAll()" v-model="select_all"  id="cb-select-all-2" type="checkbox">
                                    </td>

                                    <th scope="col" class="manage-column column-name column-primary sortable desc">
                                        <a href="#">
                                            <span>{{  __( 'Name', 'wedevs-project-manager') }}</span>
                                        </a>
                                    </th>

                                    <th scope="col" class="manage-column column-description sortable desc">
                                        <a href="#">
                                            <span>{{ __( 'Description', 'wedevs-project-manager') }}</span>
                                        </a>
                                    </th>   
                                    <!-- <th scope="col" id="description" class="manage-column column-description sortable desc">
                                        <a href="">
                                            <span>Type</span>
                                        </a>
                                    </th> -->
                                </tr>
                            </tfoot>

                        </table>


                    
                        <div class="tablenav bottom">

                            <div class="alignleft actions bulkactions">
                                <select v-model="bulk_action" name="action" id="bulk-action-selector-bottom">
                                    <option value="-1">{{ __( 'Bulk Actions', 'wedevs-project-manager') }}</option>
                                    <option value="delete">{{ __( 'Delete', 'wedevs-project-manager') }}</option>
                                </select>
                                <input type="submit" id="doaction2" class="button action" :value="__( 'Apply', 'wedevs-project-manager')">
                            </div>
                            <pm-pagination 
                                :total_pages="total_category_page" 
                                :current_page_number="current_page_number" 
                                component_name='category_pagination'>
                                
                            </pm-pagination>
                            <br class="clear">
                        </div>
                    </form>
                    
                </div>
            </div><!-- /col-right -->
        </div>
    </div>
</template>
<style type="text/css">
    .check-column {
        width: 40px;
    }
    .pm #tag-name {
        height: 28px;
    }
    .pm #tag-description {
        min-height: 84px;
    }
    .pm #bulk-action-selector-top,
    .pm #bulk-action-selector-bottom {
        height: 30px;
        width: 124px;
    }
    .pm .check-column input {
        margin: 0 0 0 8px;
    }
    .tablenav .pm-pagination-wrap {
        width: auto;
        margin-top: 0px;
        text-align: right;
    }
</style>

<script>
    import edit_category_form from './edit-category-form.vue';
    import Mixins from './mixin';

    export default {
        mixins: [Mixins],

        components: {
            'edit-category-form': edit_category_form
        },

        created () {
            this.getCategories();
        },

        data () {
            return {
                title: '',
                description: '',
                submit_disabled: false,
                delete_items: [],
                bulk_action: '-1',
                current_page_number: 1,
                select_all: false,
                show_spinner: false,
                add_new_category: __( 'Add New Category', 'wedevs-project-manager'),
            }
        },
        watch: {
            delete_items ( value ) {
                if ( this.delete_items.length === this.$root.$store.state.categories.length ) {
                    this.select_all = true;
                }else{
                   this.select_all = false; 
                }
            },
            '$route' (route) {
                this.getCategories();
            }
        },

        computed: {
            categories () {
                return this.$root.$store.state.categories;
            },

            isFetchCategories () {
                return this.$root.$store.state.isFetchCategories;
            },
            total_category_page () {
                return this.$root.$store.state.categoryMeta.pagination.total_pages;
            }
        },

        methods: {

            selectAll () {
                var self = this;
                self.delete_items =[];
                if ( self.select_all === true ){
                    this.$root.$store.state.categories.map(function(category, index) {
                        self.delete_items.push(category.id);
                    });
                }
                
            },
            catTrClass (category) {
                if (category.edit_mode) {
                    return 'inline-edit-row inline-editor';
                }
            },


            selfDeleted () {
                if ( ! confirm( this.__( 'Are you sure?', 'wedevs-project-manager') ) ) {
                    return;
                }
                var self = this;
                switch (this.bulk_action) {
                    case 'delete':
                        self.deleteCategories({category_ids: this.delete_items} );
                        break;
                }
            },

            categoryFormAction () {
                // Exit from this function, If submit button disabled 
                if ( this.submit_disabled ) {
                    return;
                }
                // Disable submit button for preventing multiple click
                this.submit_disabled = true;
                this.show_spinner = true;

                var args = {
                    data:{
                        title: this.title,
                        description: this.description,
                    }
                }
                this.newCategory(args);
                this.title ='';
                this.description = '';
            },
            selfDeleteCategory (category) {
                  var self = this;
                var args = {
                    id: category.id,
                    
                }

                self.deleteCategory(args);
            }
        }
    }
</script>