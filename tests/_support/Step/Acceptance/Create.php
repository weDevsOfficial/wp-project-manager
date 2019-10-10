<?php
namespace Step\Acceptance;

class Create extends \AcceptanceTester
{
	public function loginAsAdmin()
	{
		$I->amOnPage('/wp-admin');        
        $I->fillField('Username', 'admin');
        $I->fillField('Password', 'admin');
        $I->checkOption('rememberme');
        $I->click('Log In');
	}
	public function createCategory()
	{
		
	}
	public function createProject()
	{

	}
	public function addUser()
	{
		
	}
	public function createMilestone()
	{

	}
	public function createDiscussion()
	{

	}
	public function createTaskList()
	{

	}
	public function createTask()
	{

	}
}