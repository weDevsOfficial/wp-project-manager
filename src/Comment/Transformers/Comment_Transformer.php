<?php

namespace WeDevs\PM\Comment\Transformers;

use WeDevs\PM\Comment\Models\Comment;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\File\Transformers\File_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Comment_Transformer extends TransformerAbstract {

    use Resource_Editors;

    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $availableIncludes = [
        'replies'
    ];

    protected $defaultIncludes = [
        'files', 'creator', 'updater'
    ];

    public function transform( Comment $item ) {
        return [
            'id'               => (int) $item->id,
            'content'          => pm_get_content( $item->content ),
            'commentable_type' => $item->commentable_type,
            'commentable_id'   => $item->commentable_id,
            'created_at'       => format_date( $item->created_at ),
            'meta'       => [
                'total_replies' => $item->replies->count(),
            ],

        ];
    }

        /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "pm_comment_transformer_default_includes", $this->defaultIncludes );
    }

    /**
     * Include replies to a comment
     *
     * @param Comment $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeReplies( Comment $item ) {
        $page = isset( $_GET['reply_page'] ) ? $_GET['reply_page'] : 1;

        $replies = $item->replies()->paginate( 10, ['*'], 'reply_page', $page );

        $reply_collection = $replies->getCollection();
        $resource = $this->collection( $reply_collection, new Comment_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $replies ) );

        return $resource;
    }

    /**
     * Include files to a comment
     *
     * @param Comment $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeFiles( Comment $item ) {
        $page = isset( $_GET['file_page'] ) ? $_GET['file_page'] : 1;

        $files = $item->files()->paginate( 10, ['*'], 'file_page', $page );

        $file_collection = $files->getCollection();
        $resource = $this->collection( $file_collection, new File_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        return $resource;
    }
}
