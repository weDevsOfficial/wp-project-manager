<template>
    <div>

    <select v-model="task_recurrent_type">
        <option value="0">No Repeat</option>
        <option value="1">Repeat Weekly</option>
        <option value="2">Repeat Monthly</option>
        <option value="3">Repeat Annualy</option>
    </select>

        <a @click.prevent="openPopup()" v-if="task_recurrent_type != 0" class="button">Recurrence Settings</a>




    <div v-if="show_modal" id="pm-recurrent-task-wrap">
        <div class="nonsortable">

            <div v-if="loading" class="modal-mask half-modal pm-task-modal modal-transition">

                <div class="pm-data-load-before" >
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

            </div>


            <div v-else class="popup-mask">
                <div class="popup-container">

                    <span class="close-modal">
                        <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>
                    <div v-activity-load-more class="popup-body">

                        <h3>{{ title[task_recurrent_type].title }}</h3>
                        <hr>

                        <div class="repeat-term">
                            <label>Repeat Every :</label> {{ title[task_recurrent_type].termTitle }}
                        </div>

                        <div v-if="task_recurrent_type == 1" class="weekdays">
                            <label>Select Days :</label>
                         <span v-for="weekday in weekdays">
                             {{ weekday.name }}
                             <input type="checkbox" value="{{ weekday.value }}" v-model="weekday.checked ">
                         </span>
                        </div>
                        <label>Expire Date:</label>
                        <pm-datepickter v-model="expiry_date" class="pm-datepickter-from" dependency="pm-datepickter-to" placeholder="E"></pm-datepickter>


                    </div>

                </div>
            </div>

        </div>
    </div>

    </div>

</template>

<script>

    import date_picker from './date-picker.vue';
    
    export default {
        props: {
            recurrantInfo: {
                type: Object,
                default: function () {
                    return {
                        assignees: {
                            data: []
                        },
                        estimation: '',
                    }
                },

            },
        },
        data: function () {
            return {
                task_recurrent_type: this.recurrantInfo.recurrent,
                title: [
                    {title:'',termTitle:''},
                    {title:'Weekly Recurrence',termTitle:'Weeks'},
                    {title:'Monthly Recurrence',termTitle:'of a Month'},
                    {title:'Yearly Recurrence',termTitle:'of a Year'},
                        ],
                show_modal: false,
                weekdays:[
                    {name:'SUN', value:'0', checked: false},
                    {name:'MON', value:'1', checked: true},
                    {name:'TUE', value:'2', checked: true},
                    {name:'WED', value:'3', checked: true},
                    {name:'THU', value:'4', checked: true},
                    {name:'FRI', value:'5', checked: true},
                    {name:'SAT', value:'6', checked: false},
                ],
                expiry_date: new Date().toISOString().slice(0, 10)

            }
        },
        components: {
            'pm-datepickter': date_picker,
        },
        methods:{
            closePopup () {
                this.show_modal = false;
            },
            openPopup () {
                this.show_modal = true;
            }
        }
    }
</script>

<style scoped>
    .weekdays span { margin: auto 0.5rem; }
    .repeat-term * {
        display: inline-block;
    }
</style>


