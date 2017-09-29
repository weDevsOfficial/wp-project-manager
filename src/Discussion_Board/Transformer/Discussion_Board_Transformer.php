<?php

namespace CPM\Discussion_Board\Transformer;

use CPM\Discussion_Board\Models\Discussion_Board;
use League\Fractal\TransformerAbstract;
use CPM\Common\Transformers\Boardable_User_Transformer;
use CPM\Comment\Transformers\Comment_Transformer;
use CPM\File\Transformer\File_Transformer;
use CPM\User\Transformers\User_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Milestone\Transformer\Milestone_Transformer;
use CPM\Common\Traits\Resource_Editors;

class Discussion_Board_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater', 'users', 'milestone', 'files'
    ];

    protected $availableIncludes = [
        'comments'
    ];

    public function transform( Discussion_Board $item ) {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'order'       => $item->order,
            'created_at'  => format_date( $item->created_at ),
            'meta'        => [
                'total_comments' => $item->comments->count(),
                'total_users'    => $item->users->count(),
                'total_files'    => $item->files->count(),
            ],
        ];
    }

    public function includeUsers( Discussion_Board $item ) {
        $users = $item->users;

        return $this->collection( $users, new User_Transformer );
    }

    public function includeComments( Discussion_Board $item ) {
        $page = isset( $_GET['comment_page'] ) ? $_GET['comment_page'] : 1;

        $comments = $item->comments()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'comment_page', $page );

        $comment_collection = $comments->getCollection();
        $resource = $this->collection( $comment_collection, new Comment_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );

        return $resource;
    }

    public function includeFiles( Discussion_Board $item ) {
        $page = isset( $_GET['file_page'] ) ? $_GET['file_page'] : 1;

        $files = $item->files()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'file_page', $page );

        $file_collection = $files->getCollection();
        $resource = $this->collection( $file_collection, new File_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        return $resource;
    }

    public function includeMilestone( Discussion_Board $item ) {
        $milestone = $item->milestones->first();

        if ( $milestone ) {
            return $this->item( $milestone, new Milestone_Transformer );
        }

        return null;
    }
}