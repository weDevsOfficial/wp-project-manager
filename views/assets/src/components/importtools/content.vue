<template>
	<div class="wpuf-integrations-wrap">
		<div style="margin-top: 48px">
			<form action="" @submit.prevent="saveTrelloData()" method="post" id="trello">
				<trello :trello="trello"></trello>
			</form>
		</div>
	</div>
</template>

<script>
	import Trello from './trello' ;

	export default {
		beforeRouteEnter (to, from, next) {
            if ( pmUserCanAccess( PM_Vars.manager_cap_slug ) ) {
                next();
            } else {
                next( '/' );
            }
        },
		components: {
			'trello' : Trello
		},

		created () {
			var self = this ;
		},

		data () {
			return {
				spinner: false,
				trello : {
					import_loader : '',
					import_perc : 0 ,
				}
			}
		},

		methods: {
			saveTrelloData(){
				var self = this ;
				window.toPerc = 0 ;
				window.trellostart = false ;
				let formData = jQuery('#'+event.target.id).serialize();
				jQuery('#trello_submit').css('display','none');
				let formDataObj = JSON.parse('{"' + decodeURI(formData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
				self.trello.import_loader = "Trello data is importing now ... "; //
				this.saveTrelloImportedData(formDataObj,formDataObj,'trello/get_user',function(user_data,formDataObj){
					window.trellostart = true ;
					if(user_data == null){
						self.trello.import_loader = "Sorry ! No user found . Try valid key & token to be completed the process";
						jQuery('#trello_submit').css('display','block');
						return ;
					}
					user_data.formData = formDataObj;
					self.trello.import_loader = "Trello user data is imported . Getting boards data ... " + window.toPerc + '%';
					self.trello.import_perc = window.toPerc;
					self.saveTrelloImportedData(user_data,formDataObj,'trello/get_boards',function(brd_data,formDataObj){
						brd_data.forEach(function(item, index){
							(function(index,item){
								window.setTimeout(function(){
									var percVal ;
									if(index == 0){
										percVal = 1 ;
									}else{
										percVal = index ;
									}
									window.toPerc = ((percVal/brd_data.length) * 100).toFixed(2) ;
									var itemArr = [];
									itemArr.push(item);
									var boards_data = {} ;
									boards_data.formData = formDataObj;
									boards_data.boards_data = itemArr;
									self.trello.import_loader = "Trello board data is imported . Getting lists data ... " + window.toPerc + '%';
									self.trello.import_perc = window.toPerc;
									self.saveTrelloImportedData(boards_data,formDataObj,'trello/get_lists',function(lst_data,formDataObj){
										var lists_data = {};
										lists_data.formData = formDataObj;
										lists_data.lists_data = lst_data;
										if(window.trellostart == true) {
											self.trello.import_loader = "Trello list data is imported . Getting cards data ... " + window.toPerc + '%';
										}
										self.trello.import_perc = window.toPerc;
										self.saveTrelloImportedData(lists_data,formDataObj,'trello/get_cards',function(crd_data,formDataObj){
											var cards_data = {};
											cards_data.formData = formDataObj;
											cards_data.cards_data = crd_data;
											if(window.trellostart == true) {
												self.trello.import_loader = "Trello cards data is imported. Getting users data ... " + window.toPerc + '%';
											}
											self.trello.import_perc = window.toPerc;
											self.saveTrelloImportedData(cards_data,formDataObj,'trello/get_users',function(usrs_data,formDataObj){
												if(window.trellostart == true){
													self.trello.import_loader = "Trello assignee data is importing ..." + window.toPerc + '%';
												}

											});
											self.saveTrelloImportedData(cards_data,formDataObj,'trello/get_subcards',function(get_subcards,formDataObj){
												if(window.trellostart == true){
													self.trello.import_loader = "Trello subcard data is importing ...." + window.toPerc + '%';
												}
											});
										});
									});
									if(brd_data.length == (index + 1) && window.trellostart == true){
										window.toPerc = '' ;
										self.trello.import_loader = "Trello board data import is completed 100%";
										self.trello.import_perc = 100;
										jQuery('#trello_submit').css('display','block');
										window.trellostart = false ;
										
									}
									
								}, index * brd_data.length * 4000);
							}(index,item));
						});
					});
				});
			}
		}
	}
</script>

<style>

</style>
