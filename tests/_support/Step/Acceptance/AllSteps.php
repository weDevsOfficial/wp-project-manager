<?php
namespace Step\Acceptance;
use \Codeception\Util\Locator;

class AllSteps extends \AcceptanceTester
{

	public function loginAsAdmin()
	{
		$I = $this;
		$I->amOnPage('/wp-admin');
    $I->fillField('Username', 'admin');
    $I->fillField('Password', 'admin');
    $I->checkOption('rememberme');
    $I->click('Log In');
	}
	public function createCategorie()
	{

		$I = $this;
		$I->click('Project Manager');
		$I->click('Categories');
		$I->wait(5);
		$I->fillField( '#tag-name', $this->faker()->firstName );
		$I->fillField( 'description', $this->faker()->text( 200 ) );
		$I->click( 'Add New Category' );

	}
	public function createProject()
	{
		$I = $this;
		$I->click('Project Manager');
		$I->waitForElement('#wedevs-project-manager h3.pm-project-title', 30);
		$I->click('New Project');
		$I->fillField('#project_name', $this->faker()->text( 40 ));
		$I->fillField('.pm-form-item > .pm-project-description', $this->faker()->text( 200 ));
		$I->appendField('#project_cat', 'testing');
		$I->fillField('user', $this->faker()->userName);
		$I->wait(5);
		$I->click(['css' => '.pm-more-user-form-btn']);
		$I->wait(5);
		$I->fillField('user_name', $this->faker()->userName);
		$I->fillField('first_name', $this->faker()->firstName);
		$I->fillField('last_name', $this->faker()->lastName);
		$I->fillField('email', $this->faker()->email);
		$I->click('Create User');
		$I->wait(5);
		$I->click(['xpath' => '//input[@id="add_project"]']);

	}
	public function createDiscussion()
	{
		$I = $this;
		$I->waitForElement('.message.pm-sm-col-12.undefined', 5);
		$I->click('Discussions');
		$I->waitForElement('#pm-add-message',5);
		$I->click('Add New Discussion');
		$I->wait(5);
		$I->fillField('#message_title', $this->faker()->text( 100 ));
		// $I->fillField('["xpath" => "//body[@id="tinymce"]"]', $this->faker()->text( 200 ));
		$I->click('Add Message');
		$I->wait(5);
	}
	public function createTaskList()
	{
		$I = $this;
		// $I->waitForElement('.project-overview.pm-project-overview-container ul.todo', 10);
		$I->waitForElement('.to-do-list.pm-sm-col-12.undefined', 5);
		// $I->click('.to-do-list.pm-sm-col-12.undefined','Task Lists');
		$I->click('Task Lists');
		$I->click('Add Task List');
		$I->fillField('tasklist_name', $this->faker()->text( 50 ));
		$I->fillField('tasklist_detail', $this->faker()->text( 200 ));
		$I->click('Add List');
		$I->wait(5);
	}
	public function createMilestone()
	{
		$I = $this;
		$I->waitForElement('.milestone.pm-sm-col-12.undefined', 5);
		$I->click('Milestones');
		$I->waitForElement('#pm-add-milestone', 5);
		$I->click('Add Milestone');
		$I->fillField('#milestone_name', $this->faker()->text( 50 ));
		// $I->fillField('//body[@id="tinymce"]', $this->faker()->text( 200 ));
		$I->click('//input[@id="create_milestone"]');
		$I->wait(5);
	}
}
