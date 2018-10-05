<?php

namespace WeDevs\PM\Activity\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Project\Transformers\Project_Transformer;

class Activity_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'actor', 'project'
    ];

    public function transform( Activity $item ) {
        if ( $item->action == 'cpm_migration' ){
            $message = $item->meta['text'];
        }else {
            $message = pm_get_text( "activities.{$item->action}" ); 
        }

        return [
            'id'            => (int) $item->id,
            'message'       => $message,
            'action'        => $item->action,
            'action_type'   => $item->action_type,
            'meta'          => $this->parse_meta( $item ),
            'committed_at'  => format_date( $item->created_at ),
            'resource_id'   => $item->resource_id,
            'resource_type' => $item->resource_type,
        ];
    }

    public function includeActor( Activity $item ) {
        $actor = $item->actor;

        return $this->item( $actor, new User_Transformer );
    }

    public function includeProject( Activity $item ) {
        $project = $item->project;
        $project_transformer = new Project_Transformer;
        $project_transformer = $project_transformer->setDefaultIncludes([]);
        return $this->item ( $project, $project_transformer);
    }

    private function parse_meta( Activity $activity ) {
        $parsed_meta = [];

        switch ( $activity->resource_type ) {
            case 'task':
                $parsed_meta = $this->parse_meta_for_task( $activity );
                break;

            case 'task_list':
                $parsed_meta = $this->parse_meta_for_task_list( $activity );
                break;

            case 'discussion_board':
                $parsed_meta = $this->parse_meta_for_discussion_board( $activity );
                break;

            case 'milestone':
                $parsed_meta = $this->parse_meta_for_milestone( $activity );
                break;

            case 'project':
                $parsed_meta = $this->parse_meta_for_project( $activity );
                break;

            case 'comment':
                $parsed_meta = $this->parse_meta_for_comment( $activity );
                break;

            case 'file':
                $parsed_meta = $this->parse_meta_for_file( $activity );
                break;
        }

        return $parsed_meta;
    }

    private function parse_meta_for_task( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_task_list( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_discussion_board( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_milestone( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_project( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_file( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_comment( Activity $activity ) {
        $meta = [];

        if ( ! is_array( $activity->meta ) ) {
            return $meta;
        }

        foreach ($activity->meta as $key => $value) {
            if ( $key == 'commentable_type' && $value == 'file' ) {
                $trans_commentable_type = pm_get_text( "resource_types.{$value}" );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $trans_commentable_type;
            } elseif ( $key == 'commentable_type' ) {
                $trans_commentable_type = pm_get_text( "resource_types.{$value}" );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $activity->meta['commentable_title'];
            }elseif ($key=='comment_id'){
                //CASE " comments in discusion (undefined) by old comment resources id and text";
                $this->convertObsoleteResources();

                $comment_old=get_comment( $value );
                $comment_new=Comment::where('content',$comment_old->comment_content)->first();

                if($comment_new instanceof Comment){
                    unset($activity->meta[$key]);
                    if($comment_new->commentable_type=='task_list') {
                        $meta['comment_id'] = $comment_new->task_list()->first()->title;
                        $activity->setMetaAttribute([
                            'text'=>str_replace("meta.comment_id","meta.task_list_title",$activity->meta['text']),
                            'task_list_title'=> $comment_new->task_list()->first()->title
                        ]);
                    }elseif($comment_new->commentable_type=='task'){
                        $meta['comment_id']=$comment_new->task()->first()->title;
                        $activity->setMetaAttribute([
                            'text'=>str_replace("meta.comment_id","meta.task_title",$activity->meta['text']),
                            'task_title'=> $comment_new->task()->first()->title
                        ]);
                    }

                    $activity->resource_id=$comment_new->commentable_id;
                    $activity->resource_type=$comment_new->commentable_type;

                    return $meta;
                }
            }
        }

        return $meta;
    }

    private static $execution_count=0;

    public function convertObsoleteResources(){
        if(self::$execution_count==0){
            $activities=Activity::where('meta','like','%meta.comment_id%')
                ->where('resource_type','comment');
            
            $activities->each(function($activity){
                $comment_old=get_comment( $activity->meta['comment_id'] );
                $comment_new=Comment::where('content',$comment_old->comment_content)->first();

                if($comment_new instanceof Comment){
                    if($comment_new->commentable_type=='task_list') {
                        unset($activity->meta['comment_id']);
                        $activity->setMetaAttribute([
                            'text'=>str_replace("meta.comment_id","meta.task_list_title",$activity->meta['text']),
                            'task_list_title'=> $comment_new->task_list()->first()->title
                        ]);
                    }elseif($comment_new->commentable_type=='task'){
                        unset($activity->meta['comment_id']);
                        $activity->setMetaAttribute([
                            'text'=>str_replace("meta.comment_id","meta.task_title",$activity->meta['text']),
                            'task_title'=> $comment_new->task()->first()->title
                        ]);
                    }
                    $activity->resource_id=$comment_new->commentable_id;
                    $activity->resource_type=$comment_new->commentable_type;

                    $activity->save();
                }
            });

        }
        self::$execution_count++;
    }
}
