<?php

namespace WeDevs\PM\Discussion_Board\Transformers;

use WeDevs\PM\Discussion_Board\Models\Discussion_Board;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Common\Transformers\Boardable_User_Transformer;
use WeDevs\PM\Comment\Transformers\Comment_Transformer;
use WeDevs\PM\File\Transformers\File_Transformer;
use WeDevs\PM\User\Transformers\User_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Milestone\Transformers\Milestone_Transformer;
use WeDevs\PM\Common\Traits\Resource_Editors;
use Illuminate\Pagination\Paginator;

class Discussion_Board_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater', 'users', 'milestone', 'files'
    ];

    protected $availableIncludes = [
        'comments'
    ];

    public function transform( Discussion_Board $item ) {
        $data = [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => pm_get_content( $item->description ),
            'order'       => $item->order,
            'created_at'  => format_date( $item->created_at ),
            'meta'        => $this->meta( $item ),
        ];
        return apply_filters( 'pm_discuss_transform', $data, $item);
    
    }

    /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "pm_discuss_board_transformer_default_includes", $this->defaultIncludes );
    }

    public function meta( Discussion_Board $item ) {
        $meta = $item->metas()->get()->toArray();
        $meta = wp_list_pluck( $meta, 'meta_value', 'meta_key' );

        return array_merge( $meta, [
            'total_comments' => $item->comments->count(),
            'total_users'    => $item->users->count(),
            'total_files'    => $item->files->count(),
        ] );
    }

    public function includeUsers( Discussion_Board $item ) {
        $users = $item->users;

        return $this->collection( $users, new User_Transformer );
    }

    public function includeComments( Discussion_Board $item ) {
        $page = isset( $_GET['comment_page'] ) ? $_GET['comment_page'] : 1;

        // Paginator::currentPageResolver(function () use ($page) {
        //     return $page;
        // });

        $comments = $item->comments()
            ->orderBy( 'created_at', 'ASC' )
            ->get();

        //$comment_collection = $comments->getCollection();
        $resource = $this->collection( $comments, new Comment_Transformer );

        //$resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );
        
        return $resource;
    }

    public function includeFiles( Discussion_Board $item ) {
        $page = isset( $_GET['file_page'] ) ? $_GET['file_page'] : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $files = $item->files()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( 10 );

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