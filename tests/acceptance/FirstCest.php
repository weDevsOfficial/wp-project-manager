<?php 
use \Codeception\Util\Locator;


class FirstCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function login_successfully(AcceptanceTester $I)
    {
        
		$I->amOnPage('/wp-login.php');
		$I->fillField('log', 'admin');
		$I->fillField('pwd', 'admin');
		$I->click('wp-submit');
		
		$I->click('Project Manager');
		$I->waitForElement('#wedevs-project-manager h3.pm-project-title', 30); 
		$I->click('New Project');
		$I->fillField('#project_name', 'Codeception Testing');
		$I->click('#add_project');

		//$I->click('#wedevs-project-manager h3.pm-project-title a');

		$I->wait(20);
    }
}
