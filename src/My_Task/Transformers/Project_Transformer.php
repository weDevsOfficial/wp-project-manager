<?php

namespace WeDevs\PM\My_Task\Transformers;

use WeDevs\PM\Project\Transformers\Project_Transformer as PTransformer;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\User\Models\User;

class Project_Transformer extends PTransformer
{

     protected $defaultIncludes = [
        'tasks'
    ];

    public function includeTasks( Project $item ) {
        $tasks = $item->tasks;
        $transfomer = new Task_Transformer();
       	$transfomer = $transfomer->setDefaultIncludes(['assignees']);

        return $this->collection( $tasks, $transfomer);
    }
}
