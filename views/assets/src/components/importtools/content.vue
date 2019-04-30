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
				window.currentVal = 0;
				window.totalVal = 0;
				window.prevVal = 0;
				window.osVal = 0;
				window.toPerc = '' ;
				let formData = jQuery('#'+event.target.id).serialize();
				jQuery('#trello_submit').css('display','none');
				let formDataObj = JSON.parse('{"' + decodeURI(formData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
				self.trello.import_loader = "Trello data is importing now ... "; //
				this.saveTrelloImportedData(formDataObj,formDataObj,'trello/get_user',function(user_data,formDataObj){
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
							setTimeout(function(){
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
									//console.log('Lists - ',lists_data);
									self.trello.import_loader = "Trello list data is imported . Getting cards data ... " + window.toPerc + '%';
									self.trello.import_perc = window.toPerc;
									self.saveTrelloImportedData(lists_data,formDataObj,'trello/get_cards',function(crd_data,formDataObj){
										var cards_data = {};
										cards_data.formData = formDataObj;
										cards_data.cards_data = crd_data;
										self.trello.import_loader = "Trello cards data is imported. Getting users data ... " + window.toPerc + '%';
										self.trello.import_perc = window.toPerc;
										self.saveTrelloImportedData(cards_data,formDataObj,'trello/get_users',function(usrs_data,formDataObj){
											//console.log('Users -' , usrs_data);
											self.trello.import_loader = "Trello data importing is completed 100%";
											window.toPerc = '' ;
											self.trello.import_perc = 100;
										});
										self.saveTrelloImportedData(cards_data,formDataObj,'trello/get_subcards',function(get_subcards,formDataObj){
											//console.log('Users -' , get_subcards);
											self.trello.import_loader = "Trello data importing is completed 100%";
											window.toPerc = '' ;
											self.trello.import_perc = 100;
											jQuery('#trello_submit').css('display','block');
										});
									});
								});
							},3000);
						});
					});
				});
			}
		}
	}
</script>

<style>

</style>
