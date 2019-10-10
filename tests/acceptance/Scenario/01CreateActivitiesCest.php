<?php
class CreateProjectTaskListTaskCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    // tests
    public function createBasicActivities(\Step\Acceptance\AllSteps $I)
    {
    	$I->loginAsAdmin();
      $I->createCategorie();
      $I->createProject();
    	$I->createDiscussion();
      $I->createTaskList();
      $I->createMilestone();

    }
}
